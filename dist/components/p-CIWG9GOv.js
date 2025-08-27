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
        return (h(Host, { key: 'd223b432dd5217500238eebd6f3fb267b8470718' }, h("div", { key: '258ad03d6340909d1ef3c80045151fea906f829a', class: "satisfaction-container" }, h("div", { key: 'c429f8805dd4a78004d300f0183dffd4d07ede00', class: "satisfaction-buttons" }, h("button", { key: 'fac769701df8bb25a2f38d59474810543e97f81f', title: "R\u00E9ponse utile", class: "satisfaction-btn thumbs-up", onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: '00e444c10cac2b694521b0174a83307e3fe7c665', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '66d859d5e77e0912b86a564b2e0b196cf3fee77c', d: "M7 10v12" }), h("path", { key: 'cb65671c324d90c604d0cb43e0381c3b4b6df97c', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '4bc0cf5703797b22e14b803e6d4f17711d17b28f', title: "R\u00E9ponse inutile", class: "satisfaction-btn thumbs-down", onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: '3afa6cb18e8889ef53e6b6e54eaefe246f272396', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '84a93585229934986abc3e916ee1786b4db3758a', d: "M17 14V2" }), h("path", { key: 'e318a1ae49c822f8518d75ccfeb57b70a7e9cf1a', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
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
//# sourceMappingURL=p-CIWG9GOv.js.map

//# sourceMappingURL=p-CIWG9GOv.js.map