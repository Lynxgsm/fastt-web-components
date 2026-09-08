import { Fragment, Host, h, Env } from "@stencil/core";
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
        return (h(Host, { key: '671f9379a65e0eea32672fe46b3c45b97e372b1e' }, h("div", { key: '2aaca44f395cb02706ae1c8c166a17a25ad0e13c', class: "chat-container" }, h("div", { key: '350310731667f77c5057b594829a6490b0a462e0', class: "modal-header" }, h("span", { key: 'a96fd9d9c76d3b4b9efbb10487b4fd6fb81c1072', class: "modal-title" }, this.modalTitle)), h("div", { key: 'd019f099e40bf83a9575d944a96a03eacc2dc3c9', class: "chat-content" }, h("div", { key: '4359de6b90f902e180fbd063b1bd0185f9bb2e00', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(Fragment, null, this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "message-id": message.messageId, "api-endpoint": this.apiEndpoint }))) : (h("p", null, message.content)))))), h("form", { key: '735a1a7f96ea618676626086490ac9e1287b99d0', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '73c1cc81f84ee39ff450d32e0e3849abfcf2ae1e', name: "message", type: "text", placeholder: "Tapez votre message ici...", disabled: this.isLoading }), h("button", { key: '552c6ed2314c2d76ce9fe8ba9877fbd0105b3097', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
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
