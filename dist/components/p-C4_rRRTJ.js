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
                            else if (parsed.type === 'done') {
                                onComplete?.(parsed.message_id);
                                return;
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
                        else if (parsed.type === 'done') {
                            onComplete?.(parsed.message_id);
                            return;
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
async function handleMessageFeedback(isSatisfied, apiEndpoint, messageId, onComplete, onError) {
    try {
        const response = await fetch(`${apiEndpoint}/conversation/message/${messageId}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message_id: messageId,
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
const satisfactionStateService = new SatisfactionStateService();

const satisfactionButtonsCss = ":host{display:block !important;visibility:visible !important;height:auto !important;box-sizing:border-box;--btn-size:18px}button{all:unset}.satisfaction-container{gap:8px;margin-top:12px;padding:12px;width:100%;box-sizing:border-box}.satisfaction-buttons{display:flex !important;gap:8px;align-items:flex-start;justify-content:flex-start;width:100%}.satisfaction-btn{background:transparent !important;width:var(--btn-size) !important;height:var(--btn-size) !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;transition:all 0.2s ease !important;padding:0 !important;box-sizing:border-box !important;color:#6b7280 !important}.satisfaction-btn.active{color:#059669 !important}.satisfaction-btn.active.thumbs-down{color:#dc2626 !important}.satisfaction-btn svg{width:24px !important;height:24px !important}:host *{box-sizing:border-box !important}.satisfaction-btn,.satisfaction-btn:hover,.satisfaction-btn:active,.satisfaction-btn:focus{opacity:1 !important;visibility:visible !important}";

const SatisfactionButtons = /*@__PURE__*/ proxyCustomElement(class SatisfactionButtons extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    apiEndpoint = (Env.API_URL = 'https://fastt.celaneo.com');
    messageId = '';
    selectedButton = null;
    unsubscribe = null;
    componentDidLoad() {
        // Initialize state from service
        this.selectedButton = satisfactionStateService.getState(this.messageId);
        // Subscribe to state changes
        this.unsubscribe = satisfactionStateService.subscribe(this.messageId, state => {
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
        satisfactionStateService.setState(this.messageId, 'up');
        handleMessageFeedback(1, this.apiEndpoint, this.messageId, () => {
            console.log('Thumbs up clicked');
        });
    };
    handleThumbsDown = () => {
        satisfactionStateService.setState(this.messageId, 'down');
        handleMessageFeedback(0, this.apiEndpoint, this.messageId, () => {
            console.log('Thumbs down clicked');
        });
    };
    render() {
        return (h(Host, { key: 'd4ebe6e85f8dd4441b2afadae429c08ad9df16fe' }, h("div", { key: 'fea4ec050ce3d6808b13f0cc4f39819db9a9167b', class: "satisfaction-container" }, h("div", { key: '942733373cc4bd36a921b53b3091f2540accedf4', class: "satisfaction-buttons" }, h("button", { key: '79c3b9b58734fb80bc3ae25701676164db7e8cb8', title: "R\u00E9ponse utile", class: `satisfaction-btn thumbs-up ${this.selectedButton === 'up' ? 'active' : ''}`, onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: 'd1f69734f7872bed204ceeb27a2c80c2021150e5', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'up' ? '#ff8834' : 'none', stroke: this.selectedButton === 'up' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '8842229d6499169d7425c2bbea78f26d61c78b7c', d: "M7 10v12" }), h("path", { key: 'f8d569ed5bc4a703b0f9aba55754feb92c65d81d', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '9537896f5f742df0dd96eb37b250846724f6f1f7', title: "R\u00E9ponse inutile", class: `satisfaction-btn thumbs-down ${this.selectedButton === 'down' ? 'active' : ''}`, onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: 'c69fd8461052c1e336e0eddd04a63ec7bf6ee0ff', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'down' ? '#ff8834' : 'none', stroke: this.selectedButton === 'down' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '2def566636fd48dfbe77c04ec045832551828e5d', d: "M17 14V2" }), h("path", { key: '538bf1d23a7d3ddba3ef3f91d9220c11d54209b2', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
    }
    static get style() { return satisfactionButtonsCss; }
}, [257, "satisfaction-buttons", {
        "apiEndpoint": [1, "api-endpoint"],
        "messageId": [1, "message-id"],
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
//# sourceMappingURL=p-C4_rRRTJ.js.map

//# sourceMappingURL=p-C4_rRRTJ.js.map