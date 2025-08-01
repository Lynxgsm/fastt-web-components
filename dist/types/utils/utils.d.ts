/**
 * Generates a unique conversation ID
 * @returns A unique string identifier for conversations
 */
export declare function generateConversationId(): string;
export declare function callAIStream(message: string, apiEndpoint: string, conversationId: string, onChunk: (chunk: string) => void, onComplete?: () => void, onError?: (error: Error) => void): Promise<void>;
