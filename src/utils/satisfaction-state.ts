type SatisfactionState = 'up' | 'down' | null;

class SatisfactionStateService {
  private state: Map<string, SatisfactionState> = new Map();
  private listeners: Map<string, Set<(state: SatisfactionState) => void>> = new Map();

  setState(conversationId: string, state: SatisfactionState): void {
    this.state.set(conversationId, state);
    this.notifyListeners(conversationId, state);
  }

  getState(conversationId: string): SatisfactionState {
    return this.state.get(conversationId) || null;
  }

  subscribe(conversationId: string, callback: (state: SatisfactionState) => void): () => void {
    if (!this.listeners.has(conversationId)) {
      this.listeners.set(conversationId, new Set());
    }
    
    this.listeners.get(conversationId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(conversationId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(conversationId);
        }
      }
    };
  }

  private notifyListeners(conversationId: string, state: SatisfactionState): void {
    const listeners = this.listeners.get(conversationId);
    if (listeners) {
      listeners.forEach(callback => callback(state));
    }
  }
}

export const satisfactionStateService = new SatisfactionStateService();