import { p as proxyCustomElement, H, E as Env, h, a as Host } from './index.js';

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

const satisfactionButtonsCss = ":host{display:block !important;visibility:visible !important;height:auto !important;box-sizing:border-box;--btn-size:18px}button{all:unset}.satisfaction-container{gap:8px;margin-top:12px;padding:12px;width:100%;box-sizing:border-box}.satisfaction-buttons{display:flex !important;gap:8px;align-items:flex-start;justify-content:flex-start;width:100%}.satisfaction-btn{background:transparent !important;width:var(--btn-size) !important;height:var(--btn-size) !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;transition:all 0.2s ease !important;padding:0 !important;box-sizing:border-box !important}.satisfaction-btn svg{width:24px !important;height:24px !important}:host *{box-sizing:border-box !important}.satisfaction-btn,.satisfaction-btn:hover,.satisfaction-btn:active,.satisfaction-btn:focus{opacity:1 !important;visibility:visible !important}";

const SatisfactionButtons = /*@__PURE__*/ proxyCustomElement(class SatisfactionButtons extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    apiEndpoint = Env.API_URL;
    conversationId = '';
    handleThumbsUp = () => {
        handleFeedback(1, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs up clicked');
        });
    };
    handleThumbsDown = () => {
        handleFeedback(0, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs down clicked');
        });
    };
    render() {
        return (h(Host, { key: '78bebfd8537344847b87482f6f67205ae21b9045' }, h("div", { key: '018709cb2a0bc3f69b3d9980ef327fcad4b6eb06', class: "satisfaction-container" }, h("div", { key: '5115c40c47e426b0012217c57a4cbcb987511e44', class: "satisfaction-buttons" }, h("button", { key: 'ddacb33a1d6463f70fb488dd26ff6ae820ecb872', title: "R\u00E9ponse utile", class: "satisfaction-btn thumbs-up", onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: 'e68f92ccd7f61e4c231998b5a7e55ce91ebf8f6d', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '863866d5ebd637a2043bbacf7f9bdd9ded18a706', d: "M7 10v12" }), h("path", { key: '4945a4da9a5f33a1bd916ffd7676063b4d2c0c32', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: 'bc79b6aea875c7f4deee0ee0dfe59d4d2204fdd7', title: "R\u00E9ponse inutile", class: "satisfaction-btn thumbs-down", onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: '01a62ea2c9df93aa699e0edfb16642948e64f003', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '6f4ce94360d427f99834fecf62a0d440dc60efda', d: "M17 14V2" }), h("path", { key: 'f01d040bcd253cba4f6150a624f2747a65a97613', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
    }
    static get style() { return satisfactionButtonsCss; }
}, [257, "satisfaction-buttons", {
        "apiEndpoint": [1, "api-endpoint"],
        "conversationId": [1, "conversation-id"]
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
//# sourceMappingURL=p-Rd_qASv2.js.map

//# sourceMappingURL=p-Rd_qASv2.js.map