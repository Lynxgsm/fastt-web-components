import { r as registerInstance, h, H as Host } from './index-D3g01BZ1.js';
import { callAIStream } from './index.js';

const chatModalCss = ":host{font-family:'Yantramanav', serif, Arial, sans-serif;line-height:1.5;font-weight:400;--main-color:#ff8834}p{all:unset}button{font-family:'Signika', serif, Arial, sans-serif}input{font-family:'Yantramanav', serif, Arial, sans-serif}.modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:rgba(0, 0, 0, 0.5);display:flex;align-items:center;justify-content:center;z-index:1000;opacity:0;visibility:hidden;transition:opacity 0.3s ease, visibility 0.3s ease}.modal-overlay.visible{opacity:1;visibility:visible}.chat-container{width:90vw;height:90vh;max-width:1200px;max-height:800px;background:white;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0, 0, 0, 0.3);position:relative;transform:scale(0.8);transition:transform 0.3s ease}.modal-overlay.visible .chat-container{transform:scale(1)}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:20px 30px;border-bottom:1px solid #eee;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border-radius:12px 12px 0 0}.modal-title{font-family:'Signika', Arial, sans-serif;font-size:1.25rem;font-weight:600;margin:0}.close-button{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;padding:8px;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s ease}.close-button:hover{background-color:rgba(255, 255, 255, 0.2)}.chat-content{flex:1;display:flex;flex-direction:column;padding:30px;min-height:0}.message-container{flex:1;overflow-y:auto;margin-bottom:20px;padding:20px;border:1px solid #eee;border-radius:8px;min-height:300px}.message{margin:12px 0;padding:12px 16px;border-radius:12px;max-width:80%;word-wrap:break-word;line-height:1.4}.user-message{background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;margin-left:auto;width:fit-content;border-radius:20px 20px 0px 20px}.ai-message{background:hsla(240, 6%, 90%, 0.5);color:#333;margin-right:auto;width:fit-content;border-radius:20px 20px 20px 0px}.input-container{display:flex;gap:12px;align-items:center;background:white;padding:16px;border:1px solid #ddd;border-radius:8px;box-shadow:0 2px 8px rgba(0, 0, 0, 0.1)}input{flex:1;padding:12px 16px;border:1px solid #ddd;border-radius:6px;font-size:1rem;outline:none;transition:border-color 0.2s ease}input:focus{border-color:var(--main-color);box-shadow:0 0 0 2px rgba(236, 102, 7, 0.1)}button{padding:12px 24px;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border:none;border-radius:6px;cursor:pointer;font-size:1rem;font-weight:600;transition:transform 0.2s ease, box-shadow 0.2s ease}button:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(236, 102, 7, 0.3)}button:disabled{background:#cccccc;cursor:not-allowed;transform:none;box-shadow:none}.typing-indicator{display:none;margin:12px 0;max-width:80%;margin-right:auto}.typing-indicator.active{display:block}.typing-indicator .skeleton-container{margin:0;background:transparent;border:none;padding:12px 16px}.typing-indicator .skeleton-wrapper{gap:8px}.typing-indicator .skeleton-avatar{width:24px;height:24px;margin-bottom:0}.typing-indicator .skeleton-line{height:12px}.typing-indicator .skeleton-typing{margin-top:4px}.message-container::-webkit-scrollbar{width:8px}.message-container::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.message-container::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:4px}.message-container::-webkit-scrollbar-thumb:hover{background:#a1a1a1}@media (max-width: 768px){.chat-container{width:95vw;height:95vh;border-radius:8px}.modal-header{padding:15px 20px}.modal-title{font-size:1.25rem}.chat-content{padding:20px}.message{max-width:90%;padding:10px 12px}.input-container{padding:12px;gap:8px}input{padding:10px 12px}button{padding:10px 16px}}.ai-feedback-buttons{display:flex;gap:8px;margin-top:8px;align-items:center}.ai-feedback-buttons button{all:unset;cursor:pointer}.ai-feedback-buttons button:hover{all:unset;cursor:pointer}.thumb-up,.thumb-down{width:16px;height:16px}@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}.skeleton-container{position:relative}.skeleton-line{height:14px;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;border-radius:4px;margin-bottom:8px;position:relative;overflow:hidden}.skeleton-line:last-child{margin-bottom:0}.skeleton-line.line-1{width:95%}.skeleton-line.line-2{width:88%}.skeleton-line.line-3{width:72%}.skeleton-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;margin-bottom:12px;display:inline-block}.skeleton-wrapper{display:flex;align-items:flex-start;gap:12px}.skeleton-content{flex:1}.skeleton-typing{display:flex;align-items:center;gap:4px;margin-top:8px}.skeleton-dot{width:6px;height:6px;border-radius:50%;background-color:#6c757d;animation:typing 1.4s infinite ease-in-out}.skeleton-dot:nth-child(1){animation-delay:-0.32s}.skeleton-dot:nth-child(2){animation-delay:-0.16s}.skeleton-dot:nth-child(3){animation-delay:0s}@keyframes typing{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}.skeleton-glow{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);animation:glow 2s infinite;border-radius:inherit}@keyframes glow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}";

const ChatModal = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    open = true;
    modalTitle = "Que puis-je faire pour vous ?";
    titleStyle = {};
    messages = [];
    isLoading = false;
    iconSize = 16;
    apiEndpoint = 'http://localhost:8000';
    conversationId = '';
    componentWillLoad() {
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
    closeModal = () => {
        this.open = false;
    };
    handleChunk = async (message) => {
        try {
            const aiMessageIndex = this.messages.length - 1; // The AI message we just added
            await callAIStream(message, this.apiEndpoint, this.conversationId || '', (chunk) => {
                this.messages = this.messages.map((msg, index) => index === aiMessageIndex
                    ? { ...msg, content: msg.content + chunk }
                    : msg);
            }, () => {
                this.messages = this.messages.map((msg, index) => index === aiMessageIndex
                    ? { ...msg, isComplete: true }
                    : msg);
                this.isLoading = false;
            }, (error) => {
                console.error('AI stream error:', error);
                this.messages = this.messages.map((msg, index) => index === aiMessageIndex
                    ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true }
                    : msg);
                this.isLoading = false;
            });
        }
        catch (error) {
            console.error('Failed to call AI stream:', error);
            const aiMessageIndex = this.messages.length - 1;
            this.messages = this.messages.map((msg, index) => index === aiMessageIndex
                ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true }
                : msg);
            this.isLoading = false;
        }
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('input[name="message"]');
        const message = input.value;
        this.messages.push({ role: 'user', content: message });
        this.isLoading = true;
        form.reset();
        this.messages.push({ role: 'ai', content: '' });
        await this.handleChunk(message);
    };
    render() {
        return (h(Host, { key: '8f3047462e79d663fb6a5482a9039daf6e5c9402' }, h("div", { key: '66b8ad26edf3df076ca9115e2043266bd6925c5f', class: { 'modal-overlay': true, visible: this.open } }, h("div", { key: '58464072f0c6dda2a3b4666a4c9e77bd63b4297b', class: "chat-container" }, h("div", { key: 'a22332dfd8abfcb9b1cbfceee9ad79b3bfab15cc', class: "modal-header" }, h("span", { key: '8beeb250b848bb890545c0fe4045a109e6603781', class: "modal-title" }, this.modalTitle), h("button", { key: '2d5181dcea0539bb3b8e2c5abfc22973820e3722', class: "close-button", onClick: this.closeModal, "aria-label": "Close" }, "\u00D7")), h("div", { key: '875f1c9076a6464add1c869211c7f6c2498ecf5a', class: "chat-content" }, h("div", { key: '1e4e03d7f763cfed4537daba298eb114a5ea50f1', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(h.Fragment, null, this.isLoading && message.content === '' ? (h("chat-skeleton", null)) : message.content, message.isComplete && h("satisfaction-buttons", null))) : (h("p", null, message.content)))))), h("form", { key: '019445f3e8b63e1ca2cc33d12a322f0000089f49', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: 'a4eee9ba500715c454e03198c3cf02216846317b', name: 'message', type: 'text', placeholder: 'Tapez votre message ici...', disabled: this.isLoading }), h("button", { key: 'd19302807326752ebbf76aa79d58bce869253b9f', type: 'submit', disabled: this.isLoading, class: "send-button" }, this.isLoading ? 'Envoi...' : h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
    }
};
ChatModal.style = chatModalCss;

const chatSkeletonCss = ":host{display:block}@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}.skeleton-container{position:relative}.skeleton-line{height:14px;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;border-radius:4px;margin-bottom:8px;position:relative;overflow:hidden}.skeleton-line:last-child{margin-bottom:0}.skeleton-line.line-1{width:95%}.skeleton-line.line-2{width:88%}.skeleton-line.line-3{width:72%}.skeleton-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;margin-bottom:12px;display:inline-block}.skeleton-wrapper{display:flex;align-items:flex-start;gap:12px}.skeleton-content{flex:1}.skeleton-typing{display:flex;align-items:center;gap:4px;margin-top:8px}.skeleton-dot{width:6px;height:6px;border-radius:50%;background-color:#6c757d;animation:typing 1.4s infinite ease-in-out}.skeleton-dot:nth-child(1){animation-delay:-0.32s}.skeleton-dot:nth-child(2){animation-delay:-0.16s}.skeleton-dot:nth-child(3){animation-delay:0s}@keyframes typing{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}.skeleton-glow{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);animation:glow 2s infinite;border-radius:inherit}@keyframes glow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}";

const ChatSkeleton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: '2096c995089506157a76f0cf46cc0438202c388d' }, h("div", { key: 'ce78a4d4ef5aff3c73baa7721fee1ddd1cb41d24', class: 'skeleton-container' }, h("div", { key: '23473a136acc8ad67d870c804ccf78294e64221e', class: 'skeleton-typing' }, h("div", { key: '736709a3c4355b60b738073a2b30916a78a1a731', class: 'skeleton-dot' }), h("div", { key: 'e32141d131bc8fee237b5d50ea3a6bd65ee31caf', class: 'skeleton-dot' })))));
    }
};
ChatSkeleton.style = chatSkeletonCss;

const chatWidgetCss = ":host{max-width:600px;margin:0 auto;padding:20px;--main-color:#ff8834;font-family:'Yantramanav', serif, Arial, sans-serif}.chat-widget-container{position:fixed;bottom:24px;right:24px;width:350px;background:white;border-radius:12px;box-shadow:0 2px 16px rgba(0, 0, 0, 0.15);z-index:999;display:flex;flex-direction:column;overflow:hidden}.chat-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;background:var(--main-color);color:white;font-family:'Signika', Arial, sans-serif}.chat-title{margin:0;font-size:1.1rem;font-weight:600}.close-button{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer}.message-container{flex:1;padding:16px;overflow-y:auto;background:#f7fafc;min-height:200px}.message{margin-bottom:12px;padding:10px 14px;border-radius:8px;max-width:80%;word-break:break-word}.user-message{background:#bee3f8;align-self:flex-end;text-align:right}.ai-message{background:#e2e8f0;align-self:flex-start;text-align:left}.typing-indicator{min-height:24px;padding:0 16px;color:#888;font-size:0.9rem}.input-container{display:flex;border-top:1px solid #eee;padding:8px;background:#fff}.input{flex:1;border:1px solid #ccc;border-radius:6px;padding:8px;font-size:1rem;margin-right:8px;font-family:'Yantramanav', serif, Arial, sans-serif}.send-button{background:var(--main-color);color:white;border:none;border-radius:6px;padding:0 16px;font-size:1rem;cursor:pointer}.send-icon{width:20px;height:20px;vertical-align:middle}.chat-toggler{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#3182ce;color:white;border:none;box-shadow:0 2px 8px rgba(0, 0, 0, 0.15);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;z-index:999}.hide{display:none;opacity:0;z-index:-1;transform:translateY(50%)}";

const ChatWidget = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    messages = [];
    isLoading = false;
    isChatContainerVisible = true;
    apiEndpoint = "http://localhost:8000";
    inputEl;
    componentWillLoad() {
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
            await callAIStream(message, this.apiEndpoint, 'default', (chunk) => {
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
            h("div", { key: 'bb9f09985dd69f4f8c4cfdd55c28eb6063335c39', class: {
                    'chat-widget-container': true,
                    'hide': !this.isChatContainerVisible,
                } }, h("div", { key: 'b9e79b3b091600a3a0a62f91451d68e4acdd58a5', class: "chat-header" }, h("h3", { key: '2e0fc8a0f48078620a3666981202e37b98ec3761', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("button", { key: 'd37168178d16e2811f06474cbcfa8f5af5d29973', class: "close-button", onClick: this.toggleChatContainer }, "\u00D7")), h("div", { key: '708edd4b8987aaff2441419e61e1d4b713e7c117', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                    'message': true,
                    'user-message': message.role === 'user',
                    'ai-message': message.role === 'ai',
                } }, message.role === 'ai' ? [
                this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("span", null, message.content),
                message.isComplete && h("satisfaction-buttons", null),
            ] : h("span", null, message.content))))), h("div", { key: '8106e7c00d700a30fcad6d67cc4c6f3cd4c8faee', class: "typing-indicator" }, this.isLoading ? 'AI is typing...' : ''), h("form", { key: '634795c76efce336a4b419f1f5d516a34b7af082', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '59bc0526a887176b31eeaa0277f1b6b180d392bc', type: "text", placeholder: "Type a message...", name: "message", required: true, class: "input", ref: this.setInputRef }), h("button", { key: 'b40dded1d4dc18eef7129e048a353569b4fb3cd1', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? 'Envoi...' : (h("svg", { class: "send-icon", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })))))),
            h("button", { key: '61db8442bde86217bcde9f4944d1086df266259e', class: "chat-toggler", onClick: this.toggleChatContainer }, h("svg", { key: 'd7d7c4d09eabaa5bcbe0202dfcfe5765dfa0d0ec', xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'white', "stroke-width": '2', "stroke-linecap": 'round', "stroke-linejoin": 'round' }, h("path", { key: '4bb57586bae731dc9c3c4cbf0035fb790402d5c3', d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' })))
        ];
    }
};
ChatWidget.style = chatWidgetCss;

const satisfactionButtonsCss = ":host{display:block}";

const SatisfactionButtons = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: 'e78973a053039f884786845b8382a4d75d928a0b' }, h("slot", { key: '5166e2afcf028ca37962cee330f61b50f0e74bff' })));
    }
};
SatisfactionButtons.style = satisfactionButtonsCss;

export { ChatModal as chat_modal, ChatSkeleton as chat_skeleton, ChatWidget as chat_widget, SatisfactionButtons as satisfaction_buttons };
//# sourceMappingURL=chat-modal.chat-skeleton.chat-widget.satisfaction-buttons.entry.js.map

//# sourceMappingURL=chat-modal_4.entry.js.map