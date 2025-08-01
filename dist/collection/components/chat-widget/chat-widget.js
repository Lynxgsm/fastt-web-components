import { Env, h } from "@stencil/core";
import { callAIStream } from "../../utils/api-service";
import { generateConversationId } from "../../utils/utils";
export class ChatWidget {
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
    static get is() { return "chat-widget"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["chat-widget.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["chat-widget.css"]
        };
    }
    static get properties() {
        return {
            "apiEndpoint": {
                "type": "string",
                "attribute": "api-endpoint",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "Env.API_URL"
            }
        };
    }
    static get states() {
        return {
            "messages": {},
            "isLoading": {},
            "isChatContainerVisible": {},
            "conversationId": {}
        };
    }
}
//# sourceMappingURL=chat-widget.js.map
