import { Env, h } from "@stencil/core";
import { callAIStream } from "../../utils/api-service";
import { generateConversationId } from "../../utils/utils";
import { marked } from "marked";
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
            h("div", { key: '316ba9c2887a4470e2ae20daf1fa9b2c6eb82f5b', class: {
                    'chat-widget-container': true,
                    'hide': !this.isChatContainerVisible,
                } }, h("div", { key: 'fb2c6a5a8b1dae0f1d494de6a49094f51267ea99', class: "chat-header" }, h("h3", { key: '0e6c0c699276b32352c107baa0306a17b3b1870d', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("button", { key: '37019440d97e2a8cfec5c1b4eea3821b1a1bcfa9', class: "close-button", onClick: this.toggleChatContainer }, "\u00D7")), h("div", { key: '9d7d0ed0c7c5367dbb31ec7eea91d2dd200364f9', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                    'message': true,
                    'user-message': message.role === 'user',
                    'ai-message': message.role === 'ai',
                } }, message.role === 'ai' ? (h(h.Fragment, null, this.isLoading && message.content === '' ? (h("chat-skeleton", null)) : (h(h.Fragment, null, h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "api-endpoint": this.apiEndpoint, "message-id": message.messageId }))))) : (h("span", null, message.content)))))), h("form", { key: 'f1d441afd5f3e21169cc004071181a81356a2cca', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: 'adad055129ee55ea30bafd401e8299d732312077', type: "text", placeholder: "Tapez un message...", name: "message", required: true, class: "input", ref: this.setInputRef }), h("button", { key: '155a3aa537020e026dfcff09ebc0f7915ba989f4', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { class: "send-icon", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })))))),
            h("button", { key: '6b1a85ca4bc0a76610bc623bf2d73b46b4a8d1d1', class: "chat-toggler", onClick: this.toggleChatContainer }, h("svg", { key: 'a2cc9025c7c091e8058c9acf21c0c4aa3504498f', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { key: 'e5d99bf1b450a1cd9a7cd8cd38f119f44aeef272', d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }))),
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
