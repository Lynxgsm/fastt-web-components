import { Env, Fragment, h, Host } from "@stencil/core";
import { marked } from "marked";
import { callAIStream, fetchDecisionTree, fetchPresetAnswer, handleMessageFeedback, } from "../../utils/api-service";
import { generateConversationId } from "../../utils/utils";
const GREETING = 'Bonjour, je suis l’assistant FASTT. Sur quoi porte votre demande ?';
export class ChatConversation {
    apiEndpoint = Env.API_URL;
    turns = [];
    nodes = [];
    path = [];
    step = 'choosing';
    treeError = '';
    conversationId = '';
    nextId = 1;
    /** Nœud courant : périmètre documentaire de la saisie libre. Une question
     *  résout les documents de son thème, un thème les siens. */
    scopeNodeId = null;
    /** Message serveur soumis au vote en cours. */
    ratingMessageId = null;
    scroller;
    inputEl;
    pinnedToBottom = true;
    async componentWillLoad() {
        this.conversationId = generateConversationId();
        marked.setOptions({ breaks: true, gfm: true });
        this.say('bot', GREETING);
        try {
            this.nodes = await fetchDecisionTree(this.apiEndpoint);
            if (this.nodes.length === 0) {
                // Aucun arbre configuré : ne pas enfermer l'utilisateur dans une impasse.
                this.step = 'typing';
            }
        }
        catch (e) {
            console.error('chat-conversation:', e);
            this.treeError = "Les thèmes n'ont pas pu être chargés.";
            this.step = 'typing';
        }
    }
    componentDidRender() {
        // Les options sont épinglées sous un historique qui grandit : sans cela le
        // nouveau contenu apparaît hors écran.
        if (this.scroller && this.pinnedToBottom) {
            this.scroller.scrollTop = this.scroller.scrollHeight;
        }
    }
    onScroll = () => {
        const el = this.scroller;
        if (!el)
            return;
        this.pinnedToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    };
    say(role, content, extra = {}) {
        const id = this.nextId++;
        this.turns = [...this.turns, { id, role, content, ...extra }];
        return id;
    }
    /** Mise à jour par identifiant, jamais par position : un tour peut s'ajouter
     *  pendant qu'une réponse est en train d'arriver. */
    patch(id, patch) {
        this.turns = this.turns.map(t => (t.id === id ? { ...t, ...patch } : t));
    }
    get options() {
        const current = this.path[this.path.length - 1];
        return current ? current.children : this.nodes;
    }
    pick = async (node) => {
        this.say('user', node.label);
        this.path = [...this.path, node];
        if (node.kind === 'question') {
            this.scopeNodeId = node.id;
            await this.serveAnswer(node);
            return;
        }
        // Un thème sans question serait une impasse : on ouvre la saisie sur son
        // périmètre documentaire plutôt que de laisser l'utilisateur bloqué.
        if (node.children.length === 0) {
            this.scopeNodeId = node.id;
            this.say('bot', `Aucune question n’est encore enregistrée pour « ${node.label} ». Posez la vôtre : ` +
                'je cherche dans la documentation FASTT rattachée à ce thème.');
            this.step = 'typing';
        }
    };
    async serveAnswer(node) {
        try {
            const preset = await fetchPresetAnswer(this.apiEndpoint, node.id, this.conversationId);
            if (preset === null) {
                // Réponse pas encore rédigée : ouvrir la saisie plutôt que bloquer.
                this.say('bot', "Je n'ai pas encore de réponse enregistrée pour cette question. Posez-la avec vos mots, je cherche dans la documentation FASTT.");
                this.step = 'typing';
                return;
            }
            this.say('bot', preset.answer, { messageId: preset.message_id });
            this.ratingMessageId = preset.message_id;
            this.step = 'rating';
        }
        catch (e) {
            console.error('chat-conversation:', e);
            this.say('bot', "Je n'ai pas pu récupérer la réponse. Posez votre question, je cherche dans la documentation.");
            this.step = 'typing';
        }
    }
    rate = (helped) => {
        if (this.ratingMessageId !== null) {
            handleMessageFeedback(helped ? 1 : 0, this.apiEndpoint, String(this.ratingMessageId));
        }
        this.ratingMessageId = null;
        this.say('user', helped ? 'Oui' : 'Non');
        if (helped) {
            this.say('bot', 'Ravi d’avoir pu vous aider. Sur quel autre sujet puis-je répondre ?');
            this.path = [];
            this.scopeNodeId = null;
            this.step = 'choosing';
            return;
        }
        this.say('bot', "Navré de ne pas avoir pu vous aider. Posez votre question avec vos mots : je cherche dans l’ensemble de la documentation FASTT.");
        this.step = 'typing';
    };
    back = () => {
        this.path = this.path.slice(0, -1);
        this.scopeNodeId = null;
        this.step = 'choosing';
    };
    restart = () => {
        this.path = [];
        this.scopeNodeId = null;
        this.ratingMessageId = null;
        this.step = 'choosing';
    };
    submit = async (e) => {
        e.preventDefault();
        const value = this.inputEl?.value.trim();
        if (!value || this.step === 'streaming')
            return;
        this.say('user', value);
        const botId = this.say('bot', '', { streaming: true });
        if (this.inputEl)
            this.inputEl.value = '';
        this.step = 'streaming';
        await callAIStream(value, this.apiEndpoint, this.conversationId, (chunk) => {
            const turn = this.turns.find(t => t.id === botId);
            this.patch(botId, { content: (turn?.content ?? '') + chunk });
        }, (messageId) => {
            const id = messageId ? Number(messageId) : null;
            this.patch(botId, { streaming: false, messageId: id });
            this.ratingMessageId = id;
            this.step = 'rating';
        }, (error) => {
            console.error('chat-conversation:', error);
            this.patch(botId, {
                content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
                streaming: false,
            });
            this.step = 'typing';
        }, this.scopeNodeId, (scope) => {
            // Mention déterministe : le serveur sait avec certitude qu'il a élargi
            // la recherche. Demander au modèle de l'annoncer serait irrégulier.
            if (scope.notice_key === 'out_of_scope') {
                this.patch(botId, { outOfScopePath: scope.path });
            }
        });
    };
    renderMarkdown(content) {
        try {
            const safe = content
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
            const html = marked(safe);
            return typeof html === 'string'
                ? html.replace(/<a\s+href=/gi, '<a target="_blank" rel="noopener noreferrer" href=')
                : safe;
        }
        catch (e) {
            console.error('markdown:', e);
            return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
    }
    renderAffordance() {
        if (this.step === 'rating') {
            return (h("div", { class: "rating" }, h("p", { class: "rating-question" }, "Cela vous a-t-il aid\u00E9 ?"), h("div", { class: "rating-buttons" }, h("button", { type: "button", class: "pill", onClick: () => this.rate(true) }, "Oui"), h("button", { type: "button", class: "pill", onClick: () => this.rate(false) }, "Non"))));
        }
        if (this.step !== 'choosing')
            return null;
        if (this.treeError) {
            return h("p", { class: "notice" }, this.treeError);
        }
        const options = this.options;
        if (options.length === 0) {
            return (h("p", { class: "notice" }, "Aucune question n\u2019est encore enregistr\u00E9e pour ce th\u00E8me.", h("button", { type: "button", class: "link", onClick: this.back }, "\u2190 Retour")));
        }
        return (h("div", { class: "options" }, options.map(node => (h("button", { key: node.id, type: "button", class: "option", onClick: () => this.pick(node) }, h("span", { class: "option-label" }, node.label), node.description && h("span", { class: "option-description" }, node.description)))), this.path.length > 0 && (h("button", { type: "button", class: "link", onClick: this.back }, "\u2190 Retour"))));
    }
    render() {
        const typing = this.step === 'typing';
        return (h(Host, { key: '4c90725571b7e332bdc643c40cdbb9d781db95aa' }, h("div", { key: 'eeef1f59db981b3fe8397c7f5b8a92056aa9c7b9', class: "transcript", ref: el => (this.scroller = el), onScroll: this.onScroll }, this.turns.map(turn => (h("div", { key: turn.id, class: { turn: true, 'turn-user': turn.role === 'user', 'turn-bot': turn.role === 'bot' } }, turn.role === 'bot' ? (h(Fragment, null, turn.outOfScopePath?.length > 0 && (h("div", { class: "scope-notice" }, "Cette question sort du th\u00E8me \u00AB ", turn.outOfScopePath.join(' › '), " \u00BB. J\u2019ai cherch\u00E9 dans l\u2019ensemble des informations FASTT.")), turn.streaming && turn.content === '' ? (h("chat-skeleton", null)) : (h("div", { class: "markdown", innerHTML: this.renderMarkdown(turn.content) })))) : (h("span", null, turn.content))))), this.renderAffordance()), h("form", { key: '6ef3bb4abb5224ba76dff8cf408571a5bcf59214', class: "composer", onSubmit: this.submit }, h("input", { key: 'a709a4c84afcab486d96c915c6ba2a9996bfb640', type: "text", name: "message", ref: el => (this.inputEl = el), disabled: !typing, placeholder: typing ? 'Posez votre question…' : 'Choisissez une option ci-dessus' }), h("button", { key: 'c0e6a19c0e92a4ee3f50ed2c1c2eda89f4d0aa94', type: "submit", disabled: !typing }, "Envoyer")), this.path.length > 0 && (h("button", { key: '68649ca8e7bf5ab26ab066508026fc3eb0a51170', type: "button", class: "link restart", onClick: this.restart }, "Changer de th\u00E8me"))));
    }
    static get is() { return "chat-conversation"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["chat-conversation.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["chat-conversation.css"]
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
            "turns": {},
            "nodes": {},
            "path": {},
            "step": {},
            "treeError": {}
        };
    }
}
//# sourceMappingURL=chat-conversation.js.map
