export declare function callAIStream(message: string, apiEndpoint: string, conversationId: string, onChunk: (chunk: string) => void, onComplete?: () => void, onError?: (error: Error) => void): Promise<void>;
export declare function handleFeedback(isSatisfied: number, apiEndpoint: string, conversationId: string, onComplete?: () => void, onError?: (error: Error) => void): Promise<void>;
