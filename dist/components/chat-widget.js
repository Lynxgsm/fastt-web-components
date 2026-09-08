import { p as proxyCustomElement, H, E as Env, h } from './index.js';
import { d as defineCustomElement$2, c as callAIStream } from './p-Dg5B-YKr.js';
import { g as generateConversationId, m as marked } from './p-DuUZ2hzq.js';
import { d as defineCustomElement$3 } from './p-CpIZaQIl.js';

const chatWidgetCss = ":host{max-width:600px;margin:0 auto;padding:20px;--main-color:#ff8834;font-family:'Yantramanav', serif, Arial, sans-serif}.chat-widget-container{position:fixed;bottom:10vh;right:24px;width:350px;background:white;border-radius:12px;box-shadow:0 2px 16px rgba(0, 0, 0, 0.15);z-index:999;display:flex;flex-direction:column;overflow:hidden}.chat-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;background:var(--main-color);color:white;font-family:'Signika', Arial, sans-serif}.chat-title{margin:0;font-size:1.1rem;font-weight:600}.close-button{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer}.message-container{flex:1;padding:16px;overflow-y:scroll;background:#f7fafc;min-height:250px;max-height:250px}.message{margin:12px 0;padding:12px 16px;border-radius:12px;max-width:80%;word-wrap:break-word;line-height:1.4}.user-message{background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;margin-left:auto;width:fit-content;border-radius:20px 20px 0px 20px}.ai-message{background:hsla(240, 6%, 90%, 0.5);color:#333;margin-right:auto;width:fit-content;border-radius:20px 20px 20px 0px}.typing-indicator{min-height:24px;padding:0 16px;color:#888;font-size:0.9rem}.input-container{display:flex;border-top:1px solid #eee;padding:8px;background:#fff}.input{flex:1;border:1px solid #ccc;border-radius:6px;padding:8px;font-size:1rem;margin-right:8px;font-family:'Yantramanav', serif, Arial, sans-serif}.send-button{background:var(--main-color);color:white;border:none;border-radius:6px;padding:0 16px;font-size:1rem;cursor:pointer}.send-icon{width:20px;height:20px;vertical-align:middle}.chat-toggler{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:var(--main-color);color:white;border:none;box-shadow:0 2px 8px rgba(0, 0, 0, 0.15);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;z-index:999}.hide{display:none;opacity:0;z-index:-1;transform:translateY(50%)}.markdown-content{line-height:1.5}.markdown-content a{color:var(--main-color);text-decoration:underline}.markdown-content p{margin:0 0 8px 0}.markdown-content p:last-child{margin-bottom:0}";

const ChatWidget$1 = /*@__PURE__*/ proxyCustomElement(class ChatWidget extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    messages = [];
    isLoading = false;
    isChatContainerVisible = true;
    apiEndpoint = Env.API_URL;
    conversationId = '';
    inputEl;
    componentWillLoad() {
        // Initialize conversation ID when component first loads
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
        // Check if fonts are already loaded to avoid duplicates
        const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Signika"]');
        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Signika:wght@300..700&family=Yantramanav:wght@100;300;400;500;700;900&display=swap';
            document.head.appendChild(link);
        }
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        const input = this.inputEl;
        if (!input || !input.value.trim())
            return;
        const message = input.value;
        const userMessage = { role: 'user', content: message, isComplete: true };
        this.messages = [...this.messages, userMessage];
        input.value = '';
        this.isLoading = true;
        const aiMessageIndex = this.messages.length;
        this.messages = [...this.messages, { role: 'ai', content: '', isComplete: false }];
        try {
            await callAIStream(message, this.apiEndpoint, this.conversationId, (chunk) => {
                const newMessages = [...this.messages];
                newMessages[aiMessageIndex].content += chunk;
                this.messages = newMessages;
            }, (messageId) => {
                this.isLoading = false;
                const newMessages = [...this.messages];
                newMessages[aiMessageIndex].messageId = messageId;
                newMessages[aiMessageIndex].isComplete = true;
                this.messages = newMessages;
            }, () => {
                const newMessages = [...this.messages];
                newMessages[aiMessageIndex] = {
                    ...newMessages[aiMessageIndex],
                    content: 'Sorry, I encountered an error. Please try again.',
                    isComplete: true,
                };
                this.messages = newMessages;
                this.isLoading = false;
            });
        }
        catch (error) {
            const newMessages = [...this.messages];
            newMessages[aiMessageIndex] = {
                ...newMessages[aiMessageIndex],
                content: 'Sorry, I encountered an error. Please try again.',
                isComplete: true,
            };
            this.messages = newMessages;
            this.isLoading = false;
        }
    };
    toggleChatContainer = () => {
        this.isChatContainerVisible = !this.isChatContainerVisible;
    };
    setInputRef = (el) => {
        this.inputEl = el;
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
        return [
            h("div", { key: '373a1137698596e0a2ef186987b9b693777d4da7', class: {
                    'chat-widget-container': true,
                    'hide': !this.isChatContainerVisible,
                } }, h("div", { key: 'c03bb54b07ecf3ce6c8aac97381fcc17ef66d99c', class: "chat-header" }, h("h3", { key: 'd1354fe49bfe437a686cc9199a76772bcc7e76b0', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("button", { key: 'df072a6ae5a395ec1904388a5dfd8618fe2fe06b', class: "close-button", onClick: this.toggleChatContainer }, "\u00D7")), h("div", { key: '582760f3ed469779752b32dfd3504787b842f9b7', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                    'message': true,
                    'user-message': message.role === 'user',
                    'ai-message': message.role === 'ai',
                } }, message.role === 'ai' ? (h(h.Fragment, null, this.isLoading && message.content === '' ? (h("chat-skeleton", null)) : (h(h.Fragment, null, h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "api-endpoint": this.apiEndpoint, "message-id": message.messageId }))))) : (h("span", null, message.content)))))), h("form", { key: 'a1200110a143956a0e48bf3c4b71fd67ab16e11d', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: 'ead702f82e381f53872bc11c4f1ca82478ef7d9f', type: "text", placeholder: "Tapez un message...", name: "message", required: true, class: "input", ref: this.setInputRef }), h("button", { key: '72091ac85a630b87196a368d6ca442314043b999', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { class: "send-icon", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })))))),
            h("button", { key: '0a8eb7dcc7b4249eea9f5b6dd1b6fd60a307a7be', class: "chat-toggler", onClick: this.toggleChatContainer }, h("svg", { key: '3a5eaf61b5ca8a5ee7556151f6e25e80822881b4', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { key: '57643beb0b5a95120759392406bfb84815c709d0', d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }))),
        ];
    }
    static get style() { return chatWidgetCss; }
}, [257, "chat-widget", {
        "apiEndpoint": [1, "api-endpoint"],
        "messages": [32],
        "isLoading": [32],
        "isChatContainerVisible": [32],
        "conversationId": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["chat-widget", "chat-skeleton", "satisfaction-buttons"];
    components.forEach(tagName => { switch (tagName) {
        case "chat-widget":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ChatWidget$1);
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

const ChatWidget = ChatWidget$1;
const defineCustomElement = defineCustomElement$1;

export { ChatWidget, defineCustomElement };
//# sourceMappingURL=chat-widget.js.map

//# sourceMappingURL=chat-widget.js.map