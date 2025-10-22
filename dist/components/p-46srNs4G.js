import { p as proxyCustomElement, H, h, a as Host, E as Env } from './index.js';

async function callAIStream(message, apiEndpoint, conversationId, onChunk, onComplete, onError) {
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
async function handleFeedback(isSatisfied, apiEndpoint, conversationId, onComplete, onError) {
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
    }
}

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
const satisfactionStateService = new SatisfactionStateService();

const satisfactionButtonsCss = ":host{display:block !important;visibility:visible !important;height:auto !important;box-sizing:border-box;--btn-size:18px}button{all:unset}.satisfaction-container{gap:8px;margin-top:12px;padding:12px;width:100%;box-sizing:border-box}.satisfaction-buttons{display:flex !important;gap:8px;align-items:flex-start;justify-content:flex-start;width:100%}.satisfaction-btn{background:transparent !important;width:var(--btn-size) !important;height:var(--btn-size) !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;transition:all 0.2s ease !important;padding:0 !important;box-sizing:border-box !important;color:#6b7280 !important}.satisfaction-btn.active{color:#059669 !important}.satisfaction-btn.active.thumbs-down{color:#dc2626 !important}.satisfaction-btn svg{width:24px !important;height:24px !important}:host *{box-sizing:border-box !important}.satisfaction-btn,.satisfaction-btn:hover,.satisfaction-btn:active,.satisfaction-btn:focus{opacity:1 !important;visibility:visible !important}";

const SatisfactionButtons = /*@__PURE__*/ proxyCustomElement(class SatisfactionButtons extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    apiEndpoint = (Env.API_URL = 'https://fastt.celaneo.com');
    conversationId = '';
    selectedButton = null;
    unsubscribe = null;
    componentDidLoad() {
        // Initialize state from service
        this.selectedButton = satisfactionStateService.getState(this.conversationId);
        // Subscribe to state changes
        this.unsubscribe = satisfactionStateService.subscribe(this.conversationId, state => {
            this.selectedButton = state;
        });
    }
    disconnectedCallback() {
        // Clean up subscription
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
    handleThumbsUp = () => {
        satisfactionStateService.setState(this.conversationId, 'up');
        handleFeedback(1, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs up clicked');
        });
    };
    handleThumbsDown = () => {
        satisfactionStateService.setState(this.conversationId, 'down');
        handleFeedback(0, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs down clicked');
        });
    };
    render() {
        return (h(Host, { key: '8ab94d482d02d447ad420170a8ea5e370c742b6d' }, h("div", { key: 'cb84d0e8e4a4ad503e3d1a2594b8d5d7bad83fe1', class: "satisfaction-container" }, h("div", { key: '601cb432223837c4fdb42a675f1b2c31a6457319', class: "satisfaction-buttons" }, h("button", { key: '000e5443a1d544851261682ac1711d0d7eaaa914', title: "R\u00E9ponse utile", class: `satisfaction-btn thumbs-up ${this.selectedButton === 'up' ? 'active' : ''}`, onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: '50b22481b7cf901caf12860b41834f9362f9560c', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'up' ? '#ff8834' : 'none', stroke: this.selectedButton === 'up' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '1797fb6e93a0d5603e9b3020b93cbe6983ebb10b', d: "M7 10v12" }), h("path", { key: '993aa0a58d8113a02067b2b8c3bf571fea02eadd', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '3162e50bda221674c67716776721a5dc314765bb', title: "R\u00E9ponse inutile", class: `satisfaction-btn thumbs-down ${this.selectedButton === 'down' ? 'active' : ''}`, onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: 'b4966a5e80b1a36f498a561abb099e679c9892b5', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'down' ? '#ff8834' : 'none', stroke: this.selectedButton === 'down' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '0ef105f91663cc6f1791cc12d8a338b2a98fa098', d: "M17 14V2" }), h("path", { key: 'a97c165419a3c031635cc04261c31f63cc13ea70', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
    }
    static get style() { return satisfactionButtonsCss; }
}, [257, "satisfaction-buttons", {
        "apiEndpoint": [1, "api-endpoint"],
        "conversationId": [1, "conversation-id"],
        "selectedButton": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["satisfaction-buttons"];
    components.forEach(tagName => { switch (tagName) {
        case "satisfaction-buttons":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SatisfactionButtons);
            }
            break;
    } });
}
defineCustomElement();

export { SatisfactionButtons as S, callAIStream as c, defineCustomElement as d };
//# sourceMappingURL=p-46srNs4G.js.map

//# sourceMappingURL=p-46srNs4G.js.map