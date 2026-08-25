import { Env, Fragment, h } from "@stencil/core";
import { callAIStream } from "../../utils/api-service";
import { generateConversationId, generateMessageId } from "../../utils/utils";
import { marked } from "marked";
export class ChatWidget {
    messages = [];
    isLoading = false;
    isChatContainerVisible = true;
    apiEndpoint = Env.API_URL;
    conversationId = '';
    /** 'navigating' : arbre affiché, saisie bloquée. 'chatting' : saisie ouverte. */
    mode = 'navigating';
    contextNodeId = null;
    contextPath = [];
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
                    content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
                    isComplete: true,
                };
                this.messages = newMessages;
                this.isLoading = false;
            }, this.contextNodeId, (scope) => {
                if (scope.notice_key === 'out_of_scope') {
                    this.messages = this.messages.map((msg, index) => index === aiMessageIndex ? { ...msg, outOfScopePath: scope.path } : msg);
                }
            });
        }
        catch (error) {
            const newMessages = [...this.messages];
            newMessages[aiMessageIndex] = {
                ...newMessages[aiMessageIndex],
                content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
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
            h("div", { key: 'f5d37632179645ff98432b5af1da98b69b6978a6', class: {
                    'chat-widget-container': true,
                    'hide': !this.isChatContainerVisible,
                } }, h("div", { key: '01cd4a96b5e41986485a11dbb7e2ed393e92b871', class: "chat-header" }, h("h3", { key: '27dea1858ddb681bb895235d5d7e292099c3b567', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("button", { key: 'f5f2a78837500fbd2a2893261ee5092ab7804c15', class: "close-button", onClick: this.toggleChatContainer }, "\u00D7")), this.mode === 'chatting' && (h("div", { key: 'f015bf4580fb0aae04c612f10f1115081a9dced9', class: "context-banner" }, h("span", { key: 'abe2a95360719779c13c4514c835d2291f4dc209', class: "context-label" }, this.contextPath.length > 0 ? this.contextPath.join(' › ') : 'Toutes les informations FASTT'), h("button", { key: '836bb51f00f9995b3c33fca7ea540adcd88174ba', type: "button", class: "context-change", onClick: this.changeTheme }, "Changer de th\u00E8me"))), h("div", { key: 'a9dd50f1a879ed2d0a968666689f97dd9999fdfc', class: "message-container" }, this.mode === 'navigating' && (h("decision-tree-nav", { key: 'a0cdea32da1cc0873f9c3d1a952a6d8671ba4e95', apiEndpoint: this.apiEndpoint, onLeafSelected: this.handleLeafSelected, onSkipRequested: this.handleSkip })), this.mode === 'chatting' && this.messages.map((message, index) => (h("div", { key: index, class: {
                    'message': true,
                    'user-message': message.role === 'user',
                    'ai-message': message.role === 'ai',
                } }, message.role === 'ai' ? (h(Fragment, null, message.outOfScopePath && message.outOfScopePath.length > 0 && (h("div", { class: "scope-notice" }, "Cette question sort du th\u00E8me \u00AB ", message.outOfScopePath.join(' › '), " \u00BB. J'ai cherch\u00E9 dans l'ensemble des informations FASTT.")), this.isLoading && message.content === '' ? (h("chat-skeleton", null)) : (h(Fragment, null, h("div", { class: "markdown-content", innerHTML: this.renderMarkdown(message.content) }), message.isComplete && h("satisfaction-buttons", { "api-endpoint": this.apiEndpoint, "message-id": message.messageId }))))) : (h("span", null, message.content)))))), h("form", { key: '77395a86706643ee8352d148194223c38c792b77', class: "input-container", onSubmit: this.handleSubmit }, h("input", { key: '281f7b5e6a90204cb6ce4bde0873ce9149c21cdb', type: "text", placeholder: this.mode === 'navigating' ? 'Choisissez d’abord un thème ci-dessus' : 'Tapez un message...', name: "message", required: true, class: "input", disabled: this.isLoading || this.mode === 'navigating', ref: this.setInputRef }), h("button", { key: 'c73baee569a57a8d7f20b4982589826ec100d479', type: "submit", disabled: this.isLoading || this.mode === 'navigating', class: "send-button" }, this.isLoading ? ('Envoi...') : (h("svg", { class: "send-icon", xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("line", { x1: "22", y1: "2", x2: "11", y2: "13" }), h("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })))))),
            h("button", { key: '4fd4aa3a954b139f0babdbc049df6044c46da827', class: "chat-toggler", onClick: this.toggleChatContainer }, h("svg", { key: 'ca94263006f3b44e03d816bd49793cff4e6a3e78', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { key: '619e25ba125e9c831bbbcc4fc5fe176f292c8942', d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }))),
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
            "conversationId": {},
            "mode": {},
            "contextNodeId": {},
            "contextPath": {}
        };
    }
}
//# sourceMappingURL=chat-widget.js.map
