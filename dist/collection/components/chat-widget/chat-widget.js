import { Env, Fragment, h } from "@stencil/core";
import { callAIStream, DEFAULT_API_ENDPOINT } from "../../utils/api-service";
import { resolveConversationId, restoreMessages, startNewConversation } from "../../utils/chat-session";
import { rememberSession } from "../../utils/session-store";
import { marked } from "marked";
export class ChatWidget {
    messages = [];
    isLoading = false;
    isChatContainerVisible = true;
    apiEndpoint = Env.API_URL || DEFAULT_API_ENDPOINT;
    conversationId = '';
    isRestoring = false;
    inputEl;
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
    // dernier bloque le premier rendu s'il renvoie une promesse, et le widget resterait
    // invisible le temps de la requête.
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
        // C'est l'envoi qui persiste la session, pas le montage : avant le premier
        // message, la conversation n'existe pas encore en base. `rememberSession` renvoie
        // l'identifiant retenu — celui d'une session déjà ouverte, le cas échéant.
        this.conversationId = rememberSession(this.conversationId);
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
    // Vide l'affichage et détache la session stockée. Les messages restent en base pour
    // le back-office : c'est la vue de l'utilisateur qui repart de zéro, pas l'historique.
    handleNewConversation = () => {
        this.conversationId = startNewConversation();
        this.messages = [];
        this.isLoading = false;
        this.isRestoring = false;
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
            h("div", { key: 'd6d0f9b0486abddc3e4ecccf56bd1235f68e601e', class: {
                    'chat-widget-container': true,
                    'hide': !this.isChatContainerVisible,
                } }, h("div", { key: 'de6342bdb80299c4d978604894c5505720714f8e', class: "chat-header" }, h("h3", { key: 'af0b23844be0a2879e030f838858bda015c4c2c3', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("div", { key: 'e8f5abd5bde44bd131c22e31a5222356cc57c6d2', class: "header-actions" }, this.messages.length > 0 && (h("button", { key: 'e4ef793d7717ab469f1b418b1a56383e9b663857', class: "new-conversation-button", onClick: this.handleNewConversation, title: "Nouvelle conversation", "aria-label": "Nouvelle conversation" }, h("svg", { key: '15eb98011ff3a835885d223086f8c9fc9981ca43', xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { key: '95a9b1cfeda9b38db23a178f49781fd514faea04', d: "M12 5v14" }), h("path", { key: '6bffeba14b4eade843c46231d1f7c18627c3219b', d: "M5 12h14" })))), h("button", { key: '3cdb8c5c86e6dda0edab60056e263a8e1cc25c0a', class: "close-button", onClick: this.toggleChatContainer }, "\u00D7"))), h("div", { key: '08f3781338a7d78b999a9677070d9f83204ab95d', class: "message-container" }, this.isRestoring && h("chat-skeleton", { key: '749b261350ffa37ebb6d48a9c06ac0866360dd5c' }), this.messages.map((message, index) => (h("div", { key: index, class: {
                    'message': true,
                    'user-message': message.role === 'user',
                    'ai-message': message.role === 'ai',
                } }, message.role === 'ai' ? (h(Fragment, null, this.isLoading && message.content === '' ? (h("chat-skeleton", null)) : (h(Fragment, null, h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "api-endpoint": this.apiEndpoint, "message-id": message.messageId }))))) : (h("span", null, message.content)))))), h("form", { key: '2428ea35f0d6459d015161bf1fc7f8b0c43beb93', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '7b2e33cb82202eaf6294b6ac5204a0ca02ff9b2f', type: "text", placeholder: "Tapez un message...", name: "message", required: true, class: "input", ref: this.setInputRef }), h("button", { key: 'bae9ad29177ef14b7bbb9774bdcfd7564d6b267d', type: "submit", disabled: this.isLoading, class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { class: "send-icon", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })))))),
            h("button", { key: 'f054ccc5c2f8a961ba95ac962e8230e2578163c6', class: "chat-toggler", onClick: this.toggleChatContainer }, h("svg", { key: '8d3fa55b194657d0b10923c0b6211e3d6ece9571', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { key: '78e6ba78a3512eae97d32141fc2c3ae84eb34120', d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }))),
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
                "defaultValue": "Env.API_URL || DEFAULT_API_ENDPOINT"
            }
        };
    }
    static get states() {
        return {
            "messages": {},
            "isLoading": {},
            "isChatContainerVisible": {},
            "conversationId": {},
            "isRestoring": {}
        };
    }
}
//# sourceMappingURL=chat-widget.js.map
