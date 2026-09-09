import { Fragment, Host, h, Env } from "@stencil/core";
import { generateMessageId } from "../../utils/utils";
import { callAIStream, DEFAULT_API_ENDPOINT } from "../../utils/api-service";
import { resolveConversationId, restoreMessages, startNewConversation } from "../../utils/chat-session";
import { rememberSession } from "../../utils/session-store";
import { marked } from "marked";
export class ChatModal {
    modalTitle = 'Que puis-je faire pour vous ?';
    titleStyle = {};
    messages = [];
    isLoading = false;
    iconSize = 16;
    apiEndpoint = Env.API_URL || DEFAULT_API_ENDPOINT;
    conversationId = '';
    isRestoring = false;
    componentWillLoad() {
        // Reprendre la conversation précédente si elle n'est pas périmée, sinon en ouvrir
        // une neuve. Résolution synchrone : rien ici ne doit retarder le premier rendu.
        const { id, restored } = resolveConversationId();
        this.conversationId = id;
        this.isRestoring = restored;
        this.loadFonts();
        // Configure marked for safe rendering
        marked.setOptions({
            breaks: true, // Convert line breaks to <br>
            gfm: true, // GitHub Flavored Markdown
        });
    }
    // La relecture du transcript se fait ici, et non dans `componentWillLoad` : ce
    // dernier bloque le premier rendu s'il renvoie une promesse, et le modal resterait
    // vide le temps de la requête.
    async componentDidLoad() {
        if (!this.isRestoring)
            return;
        const result = await restoreMessages(this.apiEndpoint, this.conversationId);
        if (result.status === 'restored') {
            // L'utilisateur peut avoir envoyé un message avant la fin de la relecture :
            // l'historique se place devant, plutôt que d'écraser son échange en cours.
            this.messages = [...result.messages, ...this.messages];
        }
        else if (result.status === 'gone') {
            // L'identifiant stocké ne désigne rien en base : il n'y a rien à afficher, et
            // rien à abandonner non plus. On garde celui de cette page — en fabriquer un
            // neuf ici réécrivait le stockage et effaçait la conversation d'un autre
            // composant. `restoreMessages` a déjà purgé l'entrée devenue inutile.
            this.messages = [];
        }
        this.isRestoring = false;
    }
    // Vide l'affichage et détache la session stockée. Les messages restent en base pour
    // le back-office : c'est la vue de l'utilisateur qui repart de zéro, pas l'historique.
    handleNewConversation = () => {
        this.conversationId = startNewConversation();
        this.messages = [];
        this.isLoading = false;
        this.isRestoring = false;
    };
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
        // C'est l'envoi qui persiste la session, pas le montage : avant le premier
        // message, la conversation n'existe pas encore en base. `rememberSession` renvoie
        // l'identifiant retenu — celui d'une session déjà ouverte, le cas échéant.
        this.conversationId = rememberSession(this.conversationId);
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
        return (h(Host, { key: '0b9b7729c86c30e28272e1137b2bfda240a13045' }, h("div", { key: 'f5fd45fdbefaccb2dba7df828af95f7db3ccf972', class: "chat-container" }, h("div", { key: '86bba694ba9924d4a005816828d59f458c2e85b8', class: "modal-header" }, h("span", { key: 'e983c1353ed363aa4023123352f02355635eb8ac', class: "modal-title" }, this.modalTitle), this.messages.length > 0 && (h("button", { key: 'a441f84cbc62f25ba376d4f1131241153064cc61', class: "new-conversation-button", onClick: this.handleNewConversation, title: "Nouvelle conversation", "aria-label": "Nouvelle conversation" }, h("svg", { key: 'ad2637f4d1879a0edef5569e8cfaf4aac6577c0a', xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { key: '59fde97642906bd3bca68844830353372f8e7e88', d: "M12 5v14" }), h("path", { key: 'b1ec541fc447dd406cc7719bd9a3d55968fb706f', d: "M5 12h14" }))))), h("div", { key: 'c12dca16ebff1e114ea37c06edd7e11171c91e46', class: "chat-content" }, h("div", { key: '5a63b966b58aa25e1ce5a9b8b60f39820d1d1931', class: "message-container" }, this.isRestoring && h("chat-skeleton", { key: '2a051ab918369635fc2f211f44fc4c05d499d117' }), this.messages.map((message, index) => (h("div", { key: index, class: {
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
            } }, message.role === 'ai' ? (h(Fragment, null, this.isLoading && message.content === '' ? h("chat-skeleton", null) : h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "message-id": message.messageId, "api-endpoint": this.apiEndpoint }))) : (h("p", null, message.content)))))), h("form", { key: '731d83b7c421a4ff061da65932a7d47c5e995480', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: 'b22e8309c64a61fdad05b7203f11f6d29816ae40', name: "message", type: "text", placeholder: "Tapez votre message ici...", disabled: this.isLoading }), h("button", { key: '00a1c5afa31c731d680c1556354692108738a5c3', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { xmlns: "http://www.w3.org/2000/svg", width: this.iconSize, height: this.iconSize, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-send-horizontal-icon lucide-send-horizontal" }, h("path", { d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" }), h("path", { d: "M6 12h16" })))))))));
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
            "conversationId": {},
            "isRestoring": {}
        };
    }
}
//# sourceMappingURL=chat-modal.js.map
