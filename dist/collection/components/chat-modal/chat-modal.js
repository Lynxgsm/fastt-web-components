import { Host, h, Env } from "@stencil/core";
import { generateConversationId } from "../../utils/utils";
import { callAIStream } from "../../utils/api-service";
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
