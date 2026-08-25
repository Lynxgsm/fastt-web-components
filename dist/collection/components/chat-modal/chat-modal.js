import { Fragment, Host, h, Env } from "@stencil/core";
import { generateConversationId, generateMessageId } from "../../utils/utils";
import { callAIStream } from "../../utils/api-service";
import { marked } from "marked";
export class ChatModal {
    modalTitle = 'Que puis-je faire pour vous ?';
    titleStyle = {};
    messages = [];
    isLoading = false;
    iconSize = 16;
    apiEndpoint = Env.API_URL;
    conversationId = '';
    /** 'navigating' : arbre affiché, saisie bloquée. 'chatting' : saisie ouverte. */
    mode = 'navigating';
    contextNodeId = null;
    contextPath = [];
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
    handleLeafSelected = (e) => {
        const { node, path } = e.detail;
        this.contextNodeId = node.id;
        this.contextPath = path.map(n => n.label);
        this.mode = 'chatting';
        if (node.intro_message) {
            this.messages = [
                ...this.messages,
                { role: 'ai', content: node.intro_message, isComplete: true, messageId: generateMessageId() },
            ];
        }
    };
    /** Échappatoire : interroger tout le corpus FASTT sans passer par l'arbre. */
    handleSkip = () => {
        this.contextNodeId = null;
        this.contextPath = [];
        this.mode = 'chatting';
    };
    changeTheme = () => {
        this.contextNodeId = null;
        this.contextPath = [];
        this.mode = 'navigating';
    };
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
                this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, content: "Désolé, une erreur s'est produite. Veuillez réessayer.", isComplete: true } : msg);
                this.isLoading = false;
            }, this.contextNodeId, (scope) => {
                // Bandeau déterministe : le serveur sait avec certitude qu'il a élargi
                // la recherche, inutile de demander au modèle de l'annoncer.
                if (scope.notice_key === 'out_of_scope') {
                    this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, outOfScopePath: scope.path } : msg);
                }
            });
        }
        catch (error) {
            console.error('Failed to call AI stream:', error);
            const aiMessageIndex = this.messages.length - 1;
            this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, content: "Désolé, une erreur s'est produite. Veuillez réessayer.", isComplete: true } : msg);
            this.isLoading = false;
        }
    };
    handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('input[name="message"]');
        const message = input.value.trim();
        if (!message)
            return;
        this.messages = [
            ...this.messages,
            { role: 'user', content: message, messageId: generateMessageId() },
            { role: 'ai', content: '', messageId: generateMessageId() },
        ];
        this.isLoading = true;
        form.reset();
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
    renderContextBanner() {
        if (this.mode !== 'chatting')
            return null;
        const label = this.contextPath.length > 0 ? this.contextPath.join(' › ') : 'Toutes les informations FASTT';
        return (h("div", { class: "context-banner" }, h("span", { class: "context-label", title: label }, label), h("button", { type: "button", class: "context-change", onClick: this.changeTheme }, "Changer de th\u00E8me")));
    }
    render() {
        const navigating = this.mode === 'navigating';
        return (h(Host, { key: '7c9cb81a137816d9fe4c85e41f8c076455dbc208' }, h("div", { key: '892a6af1c520b0a834d7fffc01e976a3c209eaf3', class: "chat-container" }, h("div", { key: 'f5150c522a2010ce7d66a9b3ca695e36f7c4aa35', class: "modal-header" }, h("span", { key: 'dacd542d9b9aeb02ffcf4e1d679d679ad21e5f4c', class: "modal-title" }, this.modalTitle)), this.renderContextBanner(), h("div", { key: '3a948f6ba94e1084b572d8df0b5cb5ab8f879d2f', class: "chat-content" }, h("div", { key: '6604df81c1cb73b0f5d90b0136575a19c1d06707', class: "message-container" }, navigating && (h("decision-tree-nav", { key: '8f000a2911a78c6323ea851ba5e69cb767107836', apiEndpoint: this.apiEndpoint, onLeafSelected: this.handleLeafSelected, onSkipRequested: this.handleSkip })), !navigating && this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(Fragment, null, message.outOfScopePath && message.outOfScopePath.length > 0 && (h("div", { class: "scope-notice" }, "Cette question sort du th\u00E8me \u00AB ", message.outOfScopePath.join(' › '), " \u00BB. J'ai cherch\u00E9 dans l'ensemble des informations FASTT.")), this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "message-id": message.messageId, "api-endpoint": this.apiEndpoint }))) : (h("p", null, message.content)))))), h("form", { key: '0d96fc9d11499ea1a7776eb6d79e72399c2b5603', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '53143010d9e33fa58eca1d0b46b960293c47e1c2', name: "message", type: "text", placeholder: navigating ? 'Choisissez d’abord un thème ci-dessus' : 'Tapez votre message ici...', disabled: this.isLoading || navigating }), h("button", { key: '8d14775930a96feea1b817c25ba288b17804ad96', type: "submit", disabled: this.isLoading || navigating, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
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
                "defaultValue": "Env.API_URL"
            }
        };
    }
    static get states() {
        return {
            "messages": {},
            "isLoading": {},
            "conversationId": {},
            "mode": {},
            "contextNodeId": {},
            "contextPath": {}
        };
    }
}
//# sourceMappingURL=chat-modal.js.map
