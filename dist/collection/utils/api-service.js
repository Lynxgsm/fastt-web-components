// Repli si le build n'a pas reçu API_URL : `Env.API_URL` est figée au moment du
// build (stencil.config.ts), pas lue à l'exécution. Sans ce repli, un build sans
// .env livrerait un widget qui n'appelle rien.
export const DEFAULT_API_ENDPOINT = 'https://fastt.celaneo.com';
export async function callAIStream(message, apiEndpoint, conversationId, onChunk, onComplete, onError) {
    try {
        const response = await fetch(`${apiEndpoint}/conversation/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                prompt: message,
                conversation_id: conversationId,
            }),
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let partial = '';
        if (!reader) {
            throw new Error('Failed to get response reader');
        }
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                partial += decoder.decode();
                const lines = partial.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            onComplete?.();
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                onChunk(parsed.content);
                            }
                            else if (parsed.type === 'done') {
                                onComplete?.(parsed.message_id);
                                return;
                            }
                        }
                        catch (e) {
                            if (data.trim()) {
                                onChunk(data);
                            }
                        }
                    }
                }
                onComplete?.();
                break;
            }
            partial += decoder.decode(value, { stream: true });
            let lines = partial.split('\n');
            // Keep the last line in 'partial' in case it's incomplete
            partial = lines.pop() || '';
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        onComplete?.();
                        return;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            onChunk(parsed.content);
                        }
                        else if (parsed.type === 'done') {
                            onComplete?.(parsed.message_id);
                            return;
                        }
                    }
                    catch (e) {
                        if (data.trim()) {
                            onChunk(data);
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        onError?.(error);
    }
}
export async function handleFeedback(isSatisfied, apiEndpoint, conversationId, onComplete, onError) {
    try {
        const response = await fetch(`${apiEndpoint}/conversation/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversation_id: conversationId,
                is_satisfied: isSatisfied,
            }),
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        onComplete?.();
    }
    catch (error) {
        onError?.(error);
    }
}
export async function handleMessageFeedback(isSatisfied, apiEndpoint, messageId, onComplete, onError) {
    try {
        const response = await fetch(`${apiEndpoint}/conversation/message/${messageId}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message_id: messageId,
                is_satisfied: isSatisfied,
            }),
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        onComplete?.();
    }
    catch (error) {
        onError?.(error);
    }
}
/** Levée quand l'API répond que la conversation n'existe pas (404). */
export class ConversationGoneError extends Error {
    constructor(conversationId) {
        super(`Conversation ${conversationId} inconnue de l'API`);
        this.name = 'ConversationGoneError';
    }
}
/**
 * Relit les messages déjà enregistrés d'une conversation.
 *
 * Cette route existait pour le back-office ; elle sert ici à restaurer l'affichage
 * après un rechargement de page. Elle renvoie aussi l'état des pouces, ce qui permet
 * de retrouver un avis déjà donné.
 */
export async function fetchConversationMessages(apiEndpoint, conversationId) {
    const response = await fetch(`${apiEndpoint}/conversation/${encodeURIComponent(conversationId)}/messages`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    if (response.status === 404) {
        throw new ConversationGoneError(conversationId);
    }
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const payload = await response.json();
    return Array.isArray(payload?.messages) ? payload.messages : [];
}
//# sourceMappingURL=api-service.js.map
