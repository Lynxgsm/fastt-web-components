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
//# sourceMappingURL=api-service.js.map
