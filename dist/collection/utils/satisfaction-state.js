class SatisfactionStateService {
    state = new Map();
    listeners = new Map();
    setState(messageId, state) {
        this.state.set(messageId, state);
        this.notifyListeners(messageId, state);
    }
    getState(messageId) {
        return this.state.get(messageId) || null;
    }
    subscribe(messageId, callback) {
        if (!this.listeners.has(messageId)) {
            this.listeners.set(messageId, new Set());
        }
        this.listeners.get(messageId).add(callback);
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
    notifyListeners(messageId, state) {
        const listeners = this.listeners.get(messageId);
        if (listeners) {
            listeners.forEach(callback => callback(state));
        }
    }
}
export const satisfactionStateService = new SatisfactionStateService();
//# sourceMappingURL=satisfaction-state.js.map
