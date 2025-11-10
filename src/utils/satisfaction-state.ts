type SatisfactionState = 'up' | 'down' | null;

class SatisfactionStateService {
  private state: Map<string, SatisfactionState> = new Map();
  private listeners: Map<string, Set<(state: SatisfactionState) => void>> = new Map();

  setState(messageId: string, state: SatisfactionState): void {
    this.state.set(messageId, state);
    this.notifyListeners(messageId, state);
  }

  getState(messageId: string): SatisfactionState {
    return this.state.get(messageId) || null;
  }

  subscribe(messageId: string, callback: (state: SatisfactionState) => void): () => void {
    if (!this.listeners.has(messageId)) {
      this.listeners.set(messageId, new Set());
    }
    
    this.listeners.get(messageId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(messageId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(messageId);
        }
      }
    };
  }

  private notifyListeners(messageId: string, state: SatisfactionState): void {
    const listeners = this.listeners.get(messageId);
    if (listeners) {
      listeners.forEach(callback => callback(state));
    }
  }
}

export const satisfactionStateService = new SatisfactionStateService();