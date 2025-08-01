import { r as registerInstance, E as Env, h, H as Host } from './index-DvbVpvT7.js';

/**
 * Generates a unique conversation ID
 * @returns A unique string identifier for conversations
 */
function generateConversationId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `conv_${timestamp}_${random}`;
}

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
    apiEndpoint = Env.API_URL;
    conversationId = '';
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
    closeModal = () => {
        this.open = false;
    };
    handleChunk = async (message) => {
        try {
            const aiMessageIndex = this.messages.length - 1; // The AI message we just added
            await callAIStream(message, this.apiEndpoint, this.conversationId, (chunk) => {
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
        return (h(Host, { key: '4f4059e1b1cc71ecc34c5f6fafc90167659936f3' }, h("div", { key: 'e02da094e6b072319c1f71bbed03012b14db2c12', class: { 'modal-overlay': true, visible: this.open } }, h("div", { key: '7cb432e4c2e7638037c118f0cc78965bbdf434ae', class: "chat-container" }, h("div", { key: 'db77456fe961d9482faf3ffdb3d1361bf6d9c97a', class: "modal-header" }, h("span", { key: '45c48b6efa829ff8636e19ba32f7906e80927cdd', class: "modal-title" }, this.modalTitle), h("button", { key: 'a0c56b020c79b9d731b3e89721a3192bfc8bef49', class: "close-button", onClick: this.closeModal, "aria-label": "Close" }, "\u00D7")), h("div", { key: 'ff5d61b8f6a2d114d15f55923df51047ef851509', class: "chat-content" }, h("div", { key: 'dae59cb6ae6638a54f8a5e9c77e9a54ef0c602c7', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(h.Fragment, null, this.isLoading && message.content === '' ? (h("chat-skeleton", null)) : message.content, message.isComplete && h("satisfaction-buttons", null))) : (h("p", null, message.content)))))), h("form", { key: 'bc390570aff55025cd299b57daf0fa9d8a98c3af', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '61654d4c5f22887bce3f362f8a6922b53c960aa7', name: 'message', type: 'text', placeholder: 'Tapez votre message ici...', disabled: this.isLoading }), h("button", { key: '0fa92be242811ee600c252ec6e73e612cffeba6f', type: 'submit', disabled: this.isLoading, class: "send-button" }, this.isLoading ? 'Envoi...' : h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
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
            h("div", { key: '2ff5b5ae33293789f52949df59d49e4b81b1c429', class: {
                    'chat-widget-container': true,
                    'hide': !this.isChatContainerVisible,
                } }, h("div", { key: '309a6c5b40fb62baf63f294da7b005c2e6a826cd', class: "chat-header" }, h("h3", { key: 'c0045f2d7b5cce8630fec2fc0f8169225a1e10bd', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("button", { key: '5f979d0d6738bbde5406c9921a511e69ff832455', class: "close-button", onClick: this.toggleChatContainer }, "\u00D7")), h("div", { key: 'c40c7ed6f9f0d8e5e66bdb122ea45c27d044f9b3', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                    'message': true,
                    'user-message': message.role === 'user',
                    'ai-message': message.role === 'ai',
                } }, message.role === 'ai' ? [
                this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("span", null, message.content),
                message.isComplete && h("satisfaction-buttons", null),
            ] : h("span", null, message.content))))), h("form", { key: '1a8e303ab6415a0692b5126992991a4fb3c43127', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '3decf35ff1d8ee264a2db0a8145290d2764ca18a', type: "text", placeholder: "Type a message...", name: "message", required: true, class: "input", ref: this.setInputRef }), h("button", { key: '254b847ca89a8c3aef27b138653e17232b26319c', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? 'Envoi...' : (h("svg", { class: "send-icon", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })))))),
            h("button", { key: '487fe86437fec8e4248cf46ce8f7f0d4300e033e', class: "chat-toggler", onClick: this.toggleChatContainer }, h("svg", { key: '9c87d589b79279a9eb76208160fa7da3a4f1582a', xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'white', "stroke-width": '2', "stroke-linecap": 'round', "stroke-linejoin": 'round' }, h("path", { key: '7281ef8d8c96dbeabe138cdd8b8d321da3569553', d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' })))
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
        return (h(Host, { key: 'e56f4f726bcc459c89e8977f04476b00a5fcd74e' }, h("slot", { key: '885a78c0da5410eaa0d6e06ff7ea311685f16e6c' })));
    }
};
SatisfactionButtons.style = satisfactionButtonsCss;

export { ChatModal as chat_modal, ChatSkeleton as chat_skeleton, ChatWidget as chat_widget, SatisfactionButtons as satisfaction_buttons };
//# sourceMappingURL=chat-modal.chat-skeleton.chat-widget.satisfaction-buttons.entry.js.map

//# sourceMappingURL=chat-modal_4.entry.js.map