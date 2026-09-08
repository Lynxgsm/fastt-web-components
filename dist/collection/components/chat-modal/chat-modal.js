import { Host, h, Env } from "@stencil/core";
import { generateConversationId, generateMessageId } from "../../utils/utils";
import { callAIStream, DEFAULT_API_ENDPOINT } from "../../utils/api-service";
import { marked } from "marked";
export class ChatModal {
    modalTitle = 'Que puis-je faire pour vous ?';
    titleStyle = {};
    messages = [];
    isLoading = false;
    iconSize = 16;
    apiEndpoint = Env.API_URL || DEFAULT_API_ENDPOINT;
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
        return (h(Host, { key: 'b8a05f54e46f616ad58cc8e0cfd2062df6a3805d' }, h("div", { key: 'bb4a263f87b51699b0cdbdf21d7642871017af86', class: "chat-container" }, h("div", { key: 'f7348c3d6d519ee77974ba5d8ac823b93c2e58f4', class: "modal-header" }, h("span", { key: '8d8585e736c7ba0c215d3545580b6301e067c559', class: "modal-title" }, this.modalTitle)), h("div", { key: '74067941bc8eaef7c5acf224f15cba10d682c1c0', class: "chat-content" }, h("div", { key: '146e2a0645375b1ccd0d76a18935db9df3b91770', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(h.Fragment, null, this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "message-id": message.messageId, "api-endpoint": this.apiEndpoint }))) : (h("p", null, message.content)))))), h("form", { key: 'fbb4c3edf9e64b1f95a0f31505dcc67ed9fdcac1', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '3ecae79b396781ea8f7958d79cd117f7764ef1cd', name: "message", type: "text", placeholder: "Tapez votre message ici...", disabled: this.isLoading }), h("button", { key: '30b75c67eea14645d9a0cdea31318cc41a51e013', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
    }
    static get is() { return "chat-modal"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["chat-modal.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["chat-modal.css"]
        };
    }
    static get properties() {
        return {
            "modalTitle": {
                "type": "string",
                "attribute": "modal-title",
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
                "defaultValue": "'Que puis-je faire pour vous ?'"
            },
            "titleStyle": {
                "type": "unknown",
                "attribute": "title-style",
                "mutable": false,
                "complexType": {
                    "original": "Partial<TitleStyle>",
                    "resolved": "{ fontSize?: string; fontWeight?: string; color?: string; }",
                    "references": {
                        "Partial": {
                            "location": "global",
                            "id": "global::Partial"
                        },
                        "TitleStyle": {
                            "location": "import",
                            "path": "./types",
                            "id": "src/components/chat-modal/types.ts::TitleStyle"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "defaultValue": "{}"
            },
            "iconSize": {
                "type": "number",
                "attribute": "icon-size",
                "mutable": false,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
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
                "defaultValue": "16"
            },
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
                "defaultValue": "Env.API_URL || DEFAULT_API_ENDPOINT"
            }
        };
    }
    static get states() {
        return {
            "messages": {},
            "isLoading": {},
            "conversationId": {}
        };
    }
}
//# sourceMappingURL=chat-modal.js.map
