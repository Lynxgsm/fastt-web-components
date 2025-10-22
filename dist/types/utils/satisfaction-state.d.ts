type SatisfactionState = 'up' | 'down' | null;
declare class SatisfactionStateService {
    private state;
    private listeners;
    setState(conversationId: string, state: SatisfactionState): void;
    getState(conversationId: string): SatisfactionState;
    subscribe(conversationId: string, callback: (state: SatisfactionState) => void): () => void;
    private notifyListeners;
}
export declare const satisfactionStateService: SatisfactionStateService;
export {};
