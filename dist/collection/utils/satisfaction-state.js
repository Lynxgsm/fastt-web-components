class SatisfactionStateService {
    state = new Map();
    listeners = new Map();
    setState(conversationId, state) {
        this.state.set(conversationId, state);
        this.notifyListeners(conversationId, state);
    }
    getState(conversationId) {
        return this.state.get(conversationId) || null;
    }
    subscribe(conversationId, callback) {
        if (!this.listeners.has(conversationId)) {
            this.listeners.set(conversationId, new Set());
        }
        this.listeners.get(conversationId).add(callback);
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
    notifyListeners(conversationId, state) {
        const listeners = this.listeners.get(conversationId);
        if (listeners) {
            listeners.forEach(callback => callback(state));
        }
    }
}
export const satisfactionStateService = new SatisfactionStateService();
//# sourceMappingURL=satisfaction-state.js.map
