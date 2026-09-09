import { p as proxyCustomElement, H, E as Env, h, a as Host } from './index.js';

// Repli si le build n'a pas reçu API_URL : `Env.API_URL` est figée au moment du
// build (stencil.config.ts), pas lue à l'exécution. Sans ce repli, un build sans
// .env livrerait un widget qui n'appelle rien.
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
/** Levée quand l'API répond que la conversation n'existe pas (404). */
class ConversationGoneError extends Error {
    constructor(conversationId) {
        super(`Conversation ${conversationId} inconnue de l'API`);
        this.name = 'ConversationGoneError';
    }
}
/**
 * Relit les messages déjà enregistrés d'une conversation.
 *
 * Cette route existait pour le back-office ; elle sert ici à restaurer l'affichage
 * après un rechargement de page. Elle renvoie aussi l'état des pouces, ce qui permet
 * de retrouver un avis déjà donné.
 */
async function fetchConversationMessages(apiEndpoint, conversationId) {
    const response = await fetch(`${apiEndpoint}/conversation/${encodeURIComponent(conversationId)}/messages`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    if (response.status === 404) {
        throw new ConversationGoneError(conversationId);
    }
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const payload = await response.json();
    return Array.isArray(payload?.messages) ? payload.messages : [];
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
    apiEndpoint = Env.API_URL;
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
        return (h(Host, { key: '8eac31d683410a9f8cf5d8649d0f949057ee4d90' }, h("div", { key: '964dd9419a8d5d2c411508a549d0f5e15c9e1ef5', class: "satisfaction-container" }, h("div", { key: 'be6e0cb40c5332a46d200bdb8a0dab4ba2e90123', class: "satisfaction-buttons" }, h("button", { key: '0344318fea1bb6dfedd5991106f115cb63ef32c4', title: "R\u00E9ponse utile", class: `satisfaction-btn thumbs-up ${this.selectedButton === 'up' ? 'active' : ''}`, onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: '8bf13c17df7deada8b44ad3f1a89ea7e630975d4', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'up' ? '#ff8834' : 'none', stroke: this.selectedButton === 'up' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '01b60a3de497dddc243b0c00d02ef3fac57b5821', d: "M7 10v12" }), h("path", { key: 'b488811ed25377fbe70052a0147343eb1874b798', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '57b27ae83b12f1c9cda13c800f54d3dd32ee10e8', title: "R\u00E9ponse inutile", class: `satisfaction-btn thumbs-down ${this.selectedButton === 'down' ? 'active' : ''}`, onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: '4f056f85fe36821d0a309d5526a65e33e5ebdec8', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'down' ? '#ff8834' : 'none', stroke: this.selectedButton === 'down' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: 'e460dda1cd1bf63c529940ef32ebfd343ecb6b1d', d: "M17 14V2" }), h("path", { key: '97f24103d9cfb1928d9cda39d7f18db96ca6a9b6', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
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

export { ConversationGoneError as C, SatisfactionButtons as S, callAIStream as c, defineCustomElement as d, fetchConversationMessages as f, satisfactionStateService as s };
//# sourceMappingURL=p-DOkTtDJm.js.map

//# sourceMappingURL=p-DOkTtDJm.js.map