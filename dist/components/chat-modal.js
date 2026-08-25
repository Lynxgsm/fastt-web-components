import { p as proxyCustomElement, H, E as Env, h, F as Fragment, a as Host } from './index.js';
import { g as generateConversationId, m as marked, a as generateMessageId } from './p-DuUZ2hzq.js';
import { c as callAIStream } from './p-CQjhvsDP.js';
import { d as defineCustomElement$4 } from './p-CdAaTymN.js';
import { d as defineCustomElement$3 } from './p-DQs1oGKw.js';
import { d as defineCustomElement$2 } from './p-C20B_Kkl.js';

const chatModalCss = ":host{font-family:'Yantramanav', serif, Arial, sans-serif;line-height:1.5;font-weight:400;--main-color:#ff8834}p{all:unset}button{font-family:'Signika', serif, Arial, sans-serif}input{font-family:'Yantramanav', serif, Arial, sans-serif}.modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:rgba(0, 0, 0, 0.5);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;visibility:hidden;transition:opacity 0.3s ease, visibility 0.3s ease}.modal-overlay.visible{opacity:1;visibility:visible}.chat-container{width:100%;height:100%;background:white;border-radius:12px;display:flex;flex-direction:column;border:1px solid #eee;position:relative;transform:scale(0.8);transition:transform 0.3s ease}.modal-overlay.visible .chat-container{transform:scale(1)}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px 30px;border-bottom:1px solid #eee;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border-radius:12px 12px 0 0}.modal-title{font-family:'Signika', Arial, sans-serif;font-size:1.25rem;font-weight:600;margin:0}.close-button{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;padding:8px;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s ease}.close-button:hover{background-color:rgba(255, 255, 255, 0.2)}.chat-content{flex:1;display:flex;flex-direction:column;padding:30px;min-height:0}.message-container{flex:1;overflow-y:auto;margin-bottom:20px;padding:20px;border:1px solid #eee;border-radius:8px;min-height:300px}.message{margin:12px 0;padding:12px 16px;border-radius:12px;max-width:80%;word-wrap:break-word;line-height:1.4}.user-message{background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;margin-left:auto;width:fit-content;border-radius:20px 20px 0px 20px}.ai-message{background:hsla(240, 6%, 90%, 0.5);color:#333;margin-right:auto;width:fit-content;border-radius:20px 20px 20px 0px}.input-container{display:flex;gap:12px;align-items:center;background:white;padding:16px;border:1px solid #ddd;border-radius:8px}input{flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:6px;font-size:1rem;outline:none;transition:border-color 0.2s ease}input:focus{border-color:var(--main-color)}button{padding:12px 24px;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border:none;border-radius:6px;cursor:pointer;font-size:1rem;font-weight:600;transition:transform 0.2s ease, box-shadow 0.2s ease}button:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(236, 102, 7, 0.3)}button:disabled{background:#cccccc;cursor:not-allowed;transform:none;box-shadow:none}.typing-indicator{display:none;margin:12px 0;max-width:80%;margin-right:auto}.typing-indicator.active{display:block}.typing-indicator .skeleton-container{margin:0;background:transparent;border:none;padding:12px 16px}.typing-indicator .skeleton-wrapper{gap:8px}.typing-indicator .skeleton-avatar{width:24px;height:24px;margin-bottom:0}.typing-indicator .skeleton-line{height:12px}.typing-indicator .skeleton-typing{margin-top:4px}.message-container::-webkit-scrollbar{width:8px}.message-container::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.message-container::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}.message-container::-webkit-scrollbar-thumb:hover{background:#a1a1a1}@media (max-width: 768px){.chat-container{width:100%;height:100%;border-radius:8px}.modal-header{padding:15px 20px}.modal-title{font-size:1.25rem}.chat-content{padding:20px}.message{max-width:90%;padding:10px 12px}.input-container{padding:12px;gap:8px}input{padding:10px 12px}button{padding:10px 16px}}.ai-feedback-buttons{display:flex;gap:8px;margin-top:8px;align-items:center}.ai-feedback-buttons button{all:unset;cursor:pointer}.ai-feedback-buttons button:hover{all:unset;cursor:pointer}.markdown-content{line-height:1.6;color:inherit}.markdown-content h1,.markdown-content h2,.markdown-content h3,.markdown-content h4,.markdown-content h5,.markdown-content h6{margin:16px 0 8px 0;font-weight:600;line-height:1.3}.markdown-content h1{font-size:1.5em}.markdown-content h2{font-size:1.4em}.markdown-content h3{font-size:1.3em}.markdown-content h4{font-size:1.2em}.markdown-content h5{font-size:1.1em}.markdown-content h6{font-size:1em}.markdown-content p{margin:8px 0;line-height:1.6}.markdown-content ul,.markdown-content ol{margin:8px 0;padding-left:24px}.markdown-content li{margin:4px 0;line-height:1.5}.markdown-content blockquote{margin:12px 0;padding:8px 16px;border-left:4px solid var(--main-color);background-color:rgba(255, 136, 52, 0.1);border-radius:4px;font-style:italic}.markdown-content code{background-color:rgba(0, 0, 0, 0.1);padding:2px 6px;border-radius:3px;font-family:'Monaco', 'Menlo', 'Ubuntu Mono', monospace;font-size:0.9em}.markdown-content pre{background-color:rgba(0, 0, 0, 0.1);padding:12px;border-radius:6px;overflow-x:auto;margin:12px 0}.markdown-content pre code{background:none;padding:0;border-radius:0}.markdown-content strong{font-weight:600}.markdown-content em{font-style:italic}.markdown-content a{color:var(--main-color);text-decoration:none}.markdown-content a:hover{text-decoration:underline}.markdown-content table{border-collapse:collapse;width:100%;margin:12px 0}.markdown-content th,.markdown-content td{border:1px solid #ddd;padding:8px 12px;text-align:left}.markdown-content th{background-color:rgba(255, 136, 52, 0.1);font-weight:600}.markdown-content hr{border:none;border-top:1px solid #ddd;margin:16px 0}.thumb-up,.thumb-down{width:16px;height:16px}@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}.skeleton-container{position:relative}.skeleton-line{height:14px;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;border-radius:4px;margin-bottom:8px;position:relative;overflow:hidden}.skeleton-line:last-child{margin-bottom:0}.skeleton-line.line-1{width:95%}.skeleton-line.line-2{width:88%}.skeleton-line.line-3{width:72%}.skeleton-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;margin-bottom:12px;display:inline-block}.skeleton-wrapper{display:flex;align-items:flex-start;gap:12px}.skeleton-content{flex:1}.skeleton-typing{display:flex;align-items:center;gap:4px;margin-top:8px}.skeleton-dot{width:6px;height:6px;border-radius:50%;background-color:#6c757d;animation:typing 1.4s infinite ease-in-out}.skeleton-dot:nth-child(1){animation-delay:-0.32s}.skeleton-dot:nth-child(2){animation-delay:-0.16s}.skeleton-dot:nth-child(3){animation-delay:0s}@keyframes typing{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}.skeleton-glow{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);animation:glow 2s infinite;border-radius:inherit}@keyframes glow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}.context-banner{display:flex;align-items:center;gap:10px;padding:8px 16px;background:rgba(255, 136, 52, 0.08);border-bottom:1px solid rgba(255, 136, 52, 0.25);font-size:0.85em}.context-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;color:#8a4416}.context-change{flex-shrink:0;background:none;border:none;padding:2px 4px;color:#6b6b6b;font-size:0.95em;cursor:pointer;text-decoration:underline}.context-change:hover{color:var(--main-color)}.scope-notice{margin-bottom:8px;padding:8px 10px;background:#f4f6f8;border-left:3px solid var(--main-color);border-radius:4px;font-size:0.85em;color:#4a4a4a}";

const ChatModal$1 = /*@__PURE__*/ proxyCustomElement(class ChatModal extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    modalTitle = 'Que puis-je faire pour vous ?';
    titleStyle = {};
    messages = [];
    isLoading = false;
    iconSize = 16;
    apiEndpoint = Env.API_URL;
    conversationId = '';
    /** 'navigating' : arbre affiché, saisie bloquée. 'chatting' : saisie ouverte. */
    mode = 'navigating';
    contextNodeId = null;
    contextPath = [];
    componentWillLoad() {
        this.conversationId = generateConversationId();
        console.log('Generated conversation ID:', this.conversationId);
        this.loadFonts();
        // Configure marked for safe rendering
        marked.setOptions({
            breaks: true, // Convert line breaks to <br>
            gfm: true, // GitHub Flavored Markdown
        });
    }
    loadFonts() {
        const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Signika"]');
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Signika:wght@300..700&family=Yantramanav:wght@100;300;400;500;700;900&display=swap';
            document.head.appendChild(link);
        }
    }
    handleLeafSelected = (e) => {
        const { node, path } = e.detail;
        this.contextNodeId = node.id;
        this.contextPath = path.map(n => n.label);
        this.mode = 'chatting';
        if (node.intro_message) {
            this.messages = [
                ...this.messages,
                { role: 'ai', content: node.intro_message, isComplete: true, messageId: generateMessageId() },
            ];
        }
    };
    /** Échappatoire : interroger tout le corpus FASTT sans passer par l'arbre. */
    handleSkip = () => {
        this.contextNodeId = null;
        this.contextPath = [];
        this.mode = 'chatting';
    };
    changeTheme = () => {
        this.contextNodeId = null;
        this.contextPath = [];
        this.mode = 'navigating';
    };
    handleChunk = async (message) => {
        try {
            const aiMessageIndex = this.messages.length - 1;
            await callAIStream(message, this.apiEndpoint, this.conversationId, (chunk) => {
                this.messages = this.messages.map((msg, index) => (index === aiMessageIndex ? { ...msg, content: msg.content + chunk } : msg));
            }, (messageId) => {
                this.messages = this.messages.map((msg, index) => index === aiMessageIndex
                    ? { ...msg, isComplete: true, messageId: messageId || msg.messageId }
                    : msg);
                this.isLoading = false;
            }, (error) => {
                console.error('AI stream error:', error);
                this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, content: "Désolé, une erreur s'est produite. Veuillez réessayer.", isComplete: true } : msg);
                this.isLoading = false;
            }, this.contextNodeId, (scope) => {
                // Bandeau déterministe : le serveur sait avec certitude qu'il a élargi
                // la recherche, inutile de demander au modèle de l'annoncer.
                if (scope.notice_key === 'out_of_scope') {
                    this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, outOfScopePath: scope.path } : msg);
                }
            });
        }
        catch (error) {
            console.error('Failed to call AI stream:', error);
            const aiMessageIndex = this.messages.length - 1;
            this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, content: "Désolé, une erreur s'est produite. Veuillez réessayer.", isComplete: true } : msg);
            this.isLoading = false;
        }
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('input[name="message"]');
        const message = input.value.trim();
        if (!message)
            return;
        this.messages = [
            ...this.messages,
            { role: 'user', content: message, messageId: generateMessageId() },
            { role: 'ai', content: '', messageId: generateMessageId() },
        ];
        this.isLoading = true;
        form.reset();
        await this.handleChunk(message);
    };
    renderMarkdown(content) {
        try {
            // Sanitize the content to prevent XSS attacks
            const sanitizedContent = content
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
            // Handle both synchronous and asynchronous marked versions
            const result = marked(sanitizedContent);
            if (typeof result === 'string') {
                // Add target="_blank" to all links
                return result.replace(/<a\s+href=/gi, '<a target="_blank" rel="noopener noreferrer" href=');
            }
            else {
                // If it's a Promise, return a placeholder and handle it asynchronously
                return sanitizedContent;
            }
        }
        catch (error) {
            console.error('Error parsing markdown:', error);
            // Fallback to plain text if markdown parsing fails
            return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
    renderContextBanner() {
        if (this.mode !== 'chatting')
            return null;
        const label = this.contextPath.length > 0 ? this.contextPath.join(' › ') : 'Toutes les informations FASTT';
        return (h("div", { class: "context-banner" }, h("span", { class: "context-label", title: label }, label), h("button", { type: "button", class: "context-change", onClick: this.changeTheme }, "Changer de th\u00E8me")));
    }
    render() {
        const navigating = this.mode === 'navigating';
        return (h(Host, { key: '7c9cb81a137816d9fe4c85e41f8c076455dbc208' }, h("div", { key: '892a6af1c520b0a834d7fffc01e976a3c209eaf3', class: "chat-container" }, h("div", { key: 'f5150c522a2010ce7d66a9b3ca695e36f7c4aa35', class: "modal-header" }, h("span", { key: 'dacd542d9b9aeb02ffcf4e1d679d679ad21e5f4c', class: "modal-title" }, this.modalTitle)), this.renderContextBanner(), h("div", { key: '3a948f6ba94e1084b572d8df0b5cb5ab8f879d2f', class: "chat-content" }, h("div", { key: '6604df81c1cb73b0f5d90b0136575a19c1d06707', class: "message-container" }, navigating && (h("decision-tree-nav", { key: '8f000a2911a78c6323ea851ba5e69cb767107836', apiEndpoint: this.apiEndpoint, onLeafSelected: this.handleLeafSelected, onSkipRequested: this.handleSkip })), !navigating && this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(Fragment, null, message.outOfScopePath && message.outOfScopePath.length > 0 && (h("div", { class: "scope-notice" }, "Cette question sort du th\u00E8me \u00AB ", message.outOfScopePath.join(' › '), " \u00BB. J'ai cherch\u00E9 dans l'ensemble des informations FASTT.")), this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "message-id": message.messageId, "api-endpoint": this.apiEndpoint }))) : (h("p", null, message.content)))))), h("form", { key: '0d96fc9d11499ea1a7776eb6d79e72399c2b5603', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '53143010d9e33fa58eca1d0b46b960293c47e1c2', name: "message", type: "text", placeholder: navigating ? 'Choisissez d’abord un thème ci-dessus' : 'Tapez votre message ici...', disabled: this.isLoading || navigating }), h("button", { key: '8d14775930a96feea1b817c25ba288b17804ad96', type: "submit", disabled: this.isLoading || navigating, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
    }
    static get style() { return chatModalCss; }
}, [257, "chat-modal", {
        "modalTitle": [1, "modal-title"],
        "titleStyle": [16, "title-style"],
        "iconSize": [2, "icon-size"],
        "apiEndpoint": [1, "api-endpoint"],
        "messages": [32],
        "isLoading": [32],
        "conversationId": [32],
        "mode": [32],
        "contextNodeId": [32],
        "contextPath": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["chat-modal", "chat-skeleton", "decision-tree-nav", "satisfaction-buttons"];
    components.forEach(tagName => { switch (tagName) {
        case "chat-modal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ChatModal$1);
            }
            break;
        case "chat-skeleton":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "decision-tree-nav":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "satisfaction-buttons":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}
defineCustomElement$1();

const ChatModal = ChatModal$1;
const defineCustomElement = defineCustomElement$1;

export { ChatModal, defineCustomElement };
//# sourceMappingURL=chat-modal.js.map

//# sourceMappingURL=chat-modal.js.map