export declare const DEFAULT_API_ENDPOINT = "https://fastt.celaneo.com";
export declare function callAIStream(message: string, apiEndpoint: string, conversationId: string, onChunk: (chunk: string) => void, onComplete?: (messageId?: string) => void, onError?: (error: Error) => void): Promise<void>;
export declare function handleFeedback(isSatisfied: number, apiEndpoint: string, conversationId: string, onComplete?: () => void, onError?: (error: Error) => void): Promise<void>;
export declare function handleMessageFeedback(isSatisfied: number, apiEndpoint: string, messageId: string, onComplete?: () => void, onError?: (error: Error) => void): Promise<void>;
/** Un message tel que le renvoie `GET /conversation/{id}/messages`. */
export interface StoredMessage {
    id: number;
    actor: string;
    message: string;
    is_satisfied: boolean | null;
}
/** Levée quand l'API répond que la conversation n'existe pas (404). */
export declare class ConversationGoneError extends Error {
    constructor(conversationId: string);
}
/**
 * Relit les messages déjà enregistrés d'une conversation.
 *
 * Cette route existait pour le back-office ; elle sert ici à restaurer l'affichage
 * après un rechargement de page. Elle renvoie aussi l'état des pouces, ce qui permet
 * de retrouver un avis déjà donné.
 */
export declare function fetchConversationMessages(apiEndpoint: string, conversationId: string): Promise<StoredMessage[]>;
