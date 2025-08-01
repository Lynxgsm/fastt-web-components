import { Host, h, Env } from "@stencil/core";
import { callAIStream } from "../../utils/utils";
export class ChatModal {
    open = true;
    modalTitle = "Que puis-je faire pour vous ?";
    titleStyle = {};
    messages = [];
    isLoading = false;
    iconSize = 16;
    apiEndpoint = Env.API_URL;
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
        return (h(Host, { key: '8d1c6fb5c472a1dfa1917a14e9d50ac63301e63b' }, h("div", { key: 'a33f74e30f8ad6cc66593f3e64ee34743a295d32', class: { 'modal-overlay': true, visible: this.open } }, h("div", { key: 'c0fd9b92dae0ff6f3bb4e84585fcdf9d8d080e6f', class: "chat-container" }, h("div", { key: '25b06d7a50df99b0d5691571661ede1a3e3e52e6', class: "modal-header" }, h("span", { key: '8c0cd44cfd26f8350a12023cdc8a631cec20eec5', class: "modal-title" }, this.modalTitle), h("button", { key: '4fe88e5aefc7f776ec4def8315be553fdea9decf', class: "close-button", onClick: this.closeModal, "aria-label": "Close" }, "\u00D7")), h("div", { key: '19342d09f8dc4434fd964fde3976265a0d41d30d', class: "chat-content" }, h("div", { key: 'bc1eb5a51e8cb5b80fe583a7f61e378945ba28c3', class: "message-container" }, this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(h.Fragment, null, this.isLoading && message.content === '' ? (h("chat-skeleton", null)) : message.content, message.isComplete && h("satisfaction-buttons", null))) : (h("p", null, message.content)))))), h("form", { key: '079d3496eec9c76111686833e851fc1b29a210cf', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: 'a39f280258526d906df55fc27413ea3ad1c1c1e4', name: 'message', type: 'text', placeholder: 'Tapez votre message ici...', disabled: this.isLoading }), h("button", { key: 'e18084fd8b072d09be98bbe826540c36d18caf20', type: 'submit', disabled: this.isLoading, class: "send-button" }, this.isLoading ? 'Envoi...' : h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
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
                "defaultValue": "\"Que puis-je faire pour vous ?\""
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
                "defaultValue": "Env.API_URL"
            }
        };
    }
    static get states() {
        return {
            "open": {},
            "messages": {},
            "isLoading": {},
            "conversationId": {}
        };
    }
}
//# sourceMappingURL=chat-modal.js.map
