import { h } from "@stencil/core";
import { callAIStream } from "../../utils/utils";
export class ChatWidget {
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
                "defaultValue": "\"http://localhost:8000\""
            }
        };
    }
    static get states() {
        return {
            "messages": {},
            "isLoading": {},
            "isChatContainerVisible": {}
        };
    }
}
//# sourceMappingURL=chat-widget.js.map
