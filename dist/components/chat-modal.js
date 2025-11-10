import { p as proxyCustomElement, H, E as Env, h, a as Host } from './index.js';
import { g as generateConversationId, m as marked, a as generateMessageId } from './p-DuUZ2hzq.js';
import { d as defineCustomElement$2, c as callAIStream } from './p-C4_rRRTJ.js';
import { d as defineCustomElement$3 } from './p-CpIZaQIl.js';

const chatModalCss = ":host{font-family:'Yantramanav', serif, Arial, sans-serif;line-height:1.5;font-weight:400;--main-color:#ff8834}p{all:unset}button{font-family:'Signika', serif, Arial, sans-serif}input{font-family:'Yantramanav', serif, Arial, sans-serif}.modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:rgba(0, 0, 0, 0.5);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;visibility:hidden;transition:opacity 0.3s ease, visibility 0.3s ease}.modal-overlay.visible{opacity:1;visibility:visible}.chat-container{width:100%;height:100%;background:white;border-radius:12px;display:flex;flex-direction:column;border:1px solid #eee;position:relative;transform:scale(0.8);transition:transform 0.3s ease}.modal-overlay.visible .chat-container{transform:scale(1)}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px 30px;border-bottom:1px solid #eee;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border-radius:12px 12px 0 0}.modal-title{font-family:'Signika', Arial, sans-serif;font-size:1.25rem;font-weight:600;margin:0}.close-button{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;padding:8px;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s ease}.close-button:hover{background-color:rgba(255, 255, 255, 0.2)}.chat-content{flex:1;display:flex;flex-direction:column;padding:30px;min-height:0}.message-container{flex:1;overflow-y:auto;margin-bottom:20px;padding:20px;border:1px solid #eee;border-radius:8px;min-height:300px}.message{margin:12px 0;padding:12px 16px;border-radius:12px;max-width:80%;word-wrap:break-word;line-height:1.4}.user-message{background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;margin-left:auto;width:fit-content;border-radius:20px 20px 0px 20px}.ai-message{background:hsla(240, 6%, 90%, 0.5);color:#333;margin-right:auto;width:fit-content;border-radius:20px 20px 20px 0px}.input-container{display:flex;gap:12px;align-items:center;background:white;padding:16px;border:1px solid #ddd;border-radius:8px}input{flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:6px;font-size:1rem;outline:none;transition:border-color 0.2s ease}input:focus{border-color:var(--main-color)}button{padding:12px 24px;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border:none;border-radius:6px;cursor:pointer;font-size:1rem;font-weight:600;transition:transform 0.2s ease, box-shadow 0.2s ease}button:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(236, 102, 7, 0.3)}button:disabled{background:#cccccc;cursor:not-allowed;transform:none;box-shadow:none}.typing-indicator{display:none;margin:12px 0;max-width:80%;margin-right:auto}.typing-indicator.active{display:block}.typing-indicator .skeleton-container{margin:0;background:transparent;border:none;padding:12px 16px}.typing-indicator .skeleton-wrapper{gap:8px}.typing-indicator .skeleton-avatar{width:24px;height:24px;margin-bottom:0}.typing-indicator .skeleton-line{height:12px}.typing-indicator .skeleton-typing{margin-top:4px}.message-container::-webkit-scrollbar{width:8px}.message-container::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.message-container::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}.message-container::-webkit-scrollbar-thumb:hover{background:#a1a1a1}@media (max-width: 768px){.chat-container{width:100%;height:100%;border-radius:8px}.modal-header{padding:15px 20px}.modal-title{font-size:1.25rem}.chat-content{padding:20px}.message{max-width:90%;padding:10px 12px}.input-container{padding:12px;gap:8px}input{padding:10px 12px}button{padding:10px 16px}}.ai-feedback-buttons{display:flex;gap:8px;margin-top:8px;align-items:center}.ai-feedback-buttons button{all:unset;cursor:pointer}.ai-feedback-buttons button:hover{all:unset;cursor:pointer}.markdown-content{line-height:1.6;color:inherit}.markdown-content h1,.markdown-content h2,.markdown-content h3,.markdown-content h4,.markdown-content h5,.markdown-content h6{margin:16px 0 8px 0;font-weight:600;line-height:1.3}.markdown-content h1{font-size:1.5em}.markdown-content h2{font-size:1.4em}.markdown-content h3{font-size:1.3em}.markdown-content h4{font-size:1.2em}.markdown-content h5{font-size:1.1em}.markdown-content h6{font-size:1em}.markdown-content p{margin:8px 0;line-height:1.6}.markdown-content ul,.markdown-content ol{margin:8px 0;padding-left:24px}.markdown-content li{margin:4px 0;line-height:1.5}.markdown-content blockquote{margin:12px 0;padding:8px 16px;border-left:4px solid var(--main-color);background-color:rgba(255, 136, 52, 0.1);border-radius:4px;font-style:italic}.markdown-content code{background-color:rgba(0, 0, 0, 0.1);padding:2px 6px;border-radius:3px;font-family:'Monaco', 'Menlo', 'Ubuntu Mono', monospace;font-size:0.9em}.markdown-content pre{background-color:rgba(0, 0, 0, 0.1);padding:12px;border-radius:6px;overflow-x:auto;margin:12px 0}.markdown-content pre code{background:none;padding:0;border-radius:0}.markdown-content strong{font-weight:600}.markdown-content em{font-style:italic}.markdown-content a{color:var(--main-color);text-decoration:none}.markdown-content a:hover{text-decoration:underline}.markdown-content table{border-collapse:collapse;width:100%;margin:12px 0}.markdown-content th,.markdown-content td{border:1px solid #ddd;padding:8px 12px;text-align:left}.markdown-content th{background-color:rgba(255, 136, 52, 0.1);font-weight:600}.markdown-content hr{border:none;border-top:1px solid #ddd;margin:16px 0}.thumb-up,.thumb-down{width:16px;height:16px}@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}.skeleton-container{position:relative}.skeleton-line{height:14px;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;border-radius:4px;margin-bottom:8px;position:relative;overflow:hidden}.skeleton-line:last-child{margin-bottom:0}.skeleton-line.line-1{width:95%}.skeleton-line.line-2{width:88%}.skeleton-line.line-3{width:72%}.skeleton-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;margin-bottom:12px;display:inline-block}.skeleton-wrapper{display:flex;align-items:flex-start;gap:12px}.skeleton-content{flex:1}.skeleton-typing{display:flex;align-items:center;gap:4px;margin-top:8px}.skeleton-dot{width:6px;height:6px;border-radius:50%;background-color:#6c757d;animation:typing 1.4s infinite ease-in-out}.skeleton-dot:nth-child(1){animation-delay:-0.32s}.skeleton-dot:nth-child(2){animation-delay:-0.16s}.skeleton-dot:nth-child(3){animation-delay:0s}@keyframes typing{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}.skeleton-glow{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);animation:glow 2s infinite;border-radius:inherit}@keyframes glow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}";

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
                this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true } : msg);
                this.isLoading = false;
            });
        }
        catch (error) {
            console.error('Failed to call AI stream:', error);
            const aiMessageIndex = this.messages.length - 1;
            this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true } : msg);
            this.isLoading = false;
        }
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('input[name="message"]');
        const message = input.value;
        this.messages.push({ role: 'user', content: message, messageId: generateMessageId() });
        this.isLoading = true;
        form.reset();
        this.messages.push({ role: 'ai', content: '', messageId: generateMessageId() });
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
    render() {
        return (h(Host, { key: '7396e30f104ca6fc0a7cce1d4af9080058df3d2c' }, h("div", { key: '87b1645fc35f50c0033281b4ea8a12fe0946d685', class: "chat-container" }, h("div", { key: '1da15d0aca3b337260400b0acbc56b28a34af76b', class: "modal-header" }, h("span", { key: 'ac580439a4b570c088fb004ee7b16762f8607898', class: "modal-title" }, this.modalTitle)), h("div", { key: '1c9163fd2d71c08cd9dba9bf7969618e92a314ef', class: "chat-content" }, h("div", { key: '0bfe2fdcbb92314fa75047792372c4a7629584f0', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(h.Fragment, null, this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "message-id": message.messageId, "api-endpoint": this.apiEndpoint }))) : (h("p", null, message.content)))))), h("form", { key: '1b62c117e805ad1f7289b3f0ade37f334efe59b5', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '27e5ec69c1bf04c84879b438ff300f328164d103', name: "message", type: "text", placeholder: "Tapez votre message ici...", disabled: this.isLoading }), h("button", { key: '3f43a5c95013f07122752be3a6ab62478396e6cc', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
    }
    static get style() { return chatModalCss; }
}, [257, "chat-modal", {
        "modalTitle": [1, "modal-title"],
        "titleStyle": [16, "title-style"],
        "iconSize": [2, "icon-size"],
        "apiEndpoint": [1, "api-endpoint"],
        "messages": [32],
        "isLoading": [32],
        "conversationId": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["chat-modal", "chat-skeleton", "satisfaction-buttons"];
    components.forEach(tagName => { switch (tagName) {
        case "chat-modal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ChatModal$1);
            }
            break;
        case "chat-skeleton":
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