type SatisfactionState = 'up' | 'down' | null;
declare class SatisfactionStateService {
    private state;
    private listeners;
    setState(messageId: string, state: SatisfactionState): void;
    getState(messageId: string): SatisfactionState;
    subscribe(messageId: string, callback: (state: SatisfactionState) => void): () => void;
    private notifyListeners;
}
export declare const satisfactionStateService: SatisfactionStateService;
export {};
