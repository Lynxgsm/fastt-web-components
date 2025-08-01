import { r as registerInstance, E as Env, h } from './index-CWq9jLEG.js';
import { c as callAIStream } from './api-service-D1OJs1vA.js';
import { g as generateConversationId } from './utils-pQQEK2E1.js';

const chatWidgetCss = ":host{max-width:600px;margin:0 auto;padding:20px;--main-color:#ff8834;font-family:'Yantramanav', serif, Arial, sans-serif}.chat-widget-container{position:fixed;bottom:10vh;right:24px;width:350px;background:white;border-radius:12px;box-shadow:0 2px 16px rgba(0, 0, 0, 0.15);z-index:999;display:flex;flex-direction:column;overflow:hidden}.chat-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;background:var(--main-color);color:white;font-family:'Signika', Arial, sans-serif}.chat-title{margin:0;font-size:1.1rem;font-weight:600}.close-button{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer}.message-container{flex:1;padding:16px;overflow-y:scroll;background:#f7fafc;min-height:250px;max-height:250px}.message{margin:12px 0;padding:12px 16px;border-radius:12px;max-width:80%;word-wrap:break-word;line-height:1.4}.user-message{background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;margin-left:auto;width:fit-content;border-radius:20px 20px 0px 20px}.ai-message{background:hsla(240, 6%, 90%, 0.5);color:#333;margin-right:auto;width:fit-content;border-radius:20px 20px 20px 0px}.typing-indicator{min-height:24px;padding:0 16px;color:#888;font-size:0.9rem}.input-container{display:flex;border-top:1px solid #eee;padding:8px;background:#fff}.input{flex:1;border:1px solid #ccc;border-radius:6px;padding:8px;font-size:1rem;margin-right:8px;font-family:'Yantramanav', serif, Arial, sans-serif}.send-button{background:var(--main-color);color:white;border:none;border-radius:6px;padding:0 16px;font-size:1rem;cursor:pointer}.send-icon{width:20px;height:20px;vertical-align:middle}.chat-toggler{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:var(--main-color);color:white;border:none;box-shadow:0 2px 8px rgba(0, 0, 0, 0.15);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;z-index:999}.hide{display:none;opacity:0;z-index:-1;transform:translateY(50%)}";

const ChatWidget = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
            }, () => {
                this.isLoading = false;
                const newMessages = [...this.messages];
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
    render() {
        return [
            h("div", { key: '4021fe946c95cfec72949d1b5cd0ea0375527b15', class: {
                    'chat-widget-container': true,
                    'hide': !this.isChatContainerVisible,
                } }, h("div", { key: '78e961d2edc75d6c4fa612f15297339b76584288', class: "chat-header" }, h("h3", { key: '2e6be6dc68d17a7a5430d7ad37278ce96e418782', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("button", { key: 'ef2dc2b0b0c413b9c94481ffb3e3d63a3fd3ae1d', class: "close-button", onClick: this.toggleChatContainer }, "\u00D7")), h("div", { key: '854ae3b9f2d3ca98ccfb3acf005ee1df3af638ba', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                    'message': true,
                    'user-message': message.role === 'user',
                    'ai-message': message.role === 'ai',
                } }, message.role === 'ai' ? [
                this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("span", null, message.content),
                message.isComplete && h("satisfaction-buttons", null),
            ] : h("span", null, message.content))))), h("form", { key: '77077851fc1fac7054def40c4101d7d29f8668e9', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '57852828c7e0e06bdd4670480b575c44e244979f', type: "text", placeholder: "Type a message...", name: "message", required: true, class: "input", ref: this.setInputRef }), h("button", { key: '56486e0da83f07385d94478d61b06c0f92c75c6d', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? 'Envoi...' : (h("svg", { class: "send-icon", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })))))),
            h("button", { key: 'f0db9d608dd479efde52b30c897e61b8c297aeea', class: "chat-toggler", onClick: this.toggleChatContainer }, h("svg", { key: '73ad92b1a2e51280816157584663300139c6bc94', xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'white', "stroke-width": '2', "stroke-linecap": 'round', "stroke-linejoin": 'round' }, h("path", { key: 'ec9067cbdb07ec3f5bf4800ef112467365e93137', d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' })))
        ];
    }
};
ChatWidget.style = chatWidgetCss;

export { ChatWidget as chat_widget };
//# sourceMappingURL=chat-widget.entry.esm.js.map

//# sourceMappingURL=chat-widget.entry.js.map