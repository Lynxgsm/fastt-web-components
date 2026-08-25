import { p as proxyCustomElement, H, c as createEvent, h, a as Host } from './index.js';
import { f as fetchDecisionTree } from './p-CQjhvsDP.js';

const decisionTreeNavCss = ":host{font-family:'Yantramanav', serif, Arial, sans-serif;line-height:1.5;--main-color:#ff8834;display:block}button{font-family:'Signika', serif, Arial, sans-serif}.tree{display:flex;flex-direction:column;gap:14px;padding:4px 2px}.tree-status{padding:20px 8px;color:#666;font-size:0.95em;display:flex;flex-direction:column;gap:10px;align-items:flex-start}.tree-error{color:#b3261e}.tree-breadcrumb{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:0.85em}.crumb-group{display:inline-flex;align-items:center;gap:4px}.crumb{background:none;border:none;padding:2px 4px;color:var(--main-color);cursor:pointer;font-size:inherit;border-radius:4px}.crumb:hover:not(:disabled){background:rgba(255, 136, 52, 0.12)}.crumb:disabled{color:#666;cursor:default;font-weight:600}.crumb-sep{color:#aaa}.tree-prompt{all:unset;display:block;font-family:'Signika', serif, Arial, sans-serif;font-weight:600;font-size:1.02em;color:#222}.tree-options{display:flex;flex-direction:column;gap:8px}.tree-option{display:flex;flex-direction:column;gap:2px;text-align:left;width:100%;padding:12px 14px;background:#fff;border:1px solid #e3e3e3;border-radius:10px;cursor:pointer;transition:border-color 0.15s ease, box-shadow 0.15s ease}.tree-option:hover,.tree-option:focus-visible{border-color:var(--main-color);box-shadow:0 1px 6px rgba(255, 136, 52, 0.18);outline:none}.option-label{font-weight:600;font-size:0.98em;color:#1c1c1c}.option-description{font-family:'Yantramanav', serif, Arial, sans-serif;font-size:0.85em;color:#6b6b6b}.tree-footer{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}.tree-link{background:none;border:none;padding:4px 2px;color:#6b6b6b;font-size:0.85em;cursor:pointer;text-decoration:underline}.tree-link:hover{color:var(--main-color)}.tree-skip{margin-left:auto}";

const DecisionTreeNav = /*@__PURE__*/ proxyCustomElement(class DecisionTreeNav extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.leafSelected = createEvent(this, "leafSelected");
        this.skipRequested = createEvent(this, "skipRequested");
    }
    apiEndpoint = '';
    /** Permet de sauter l'arbre et d'interroger l'ensemble du corpus FASTT. */
    allowSkip = true;
    nodes = [];
    path = [];
    isLoading = true;
    error = '';
    /** Émis quand une feuille est atteinte : le chat peut s'ouvrir. */
    leafSelected;
    /** Émis quand l'utilisateur choisit de poser directement sa question. */
    skipRequested;
    async componentWillLoad() {
        await this.load();
    }
    async load() {
        this.isLoading = true;
        this.error = '';
        try {
            this.nodes = await fetchDecisionTree(this.apiEndpoint);
            if (this.nodes.length === 0) {
                // Aucun arbre configuré : ne pas bloquer l'utilisateur dans une impasse.
                this.skipRequested.emit();
            }
        }
        catch (e) {
            this.error = "Les thèmes n'ont pas pu être chargés.";
            console.error('decision-tree-nav:', e);
        }
        finally {
            this.isLoading = false;
        }
    }
    /** Options affichées au niveau courant. */
    get options() {
        const current = this.path[this.path.length - 1];
        return current ? current.children : this.nodes;
    }
    select = (node) => {
        const nextPath = [...this.path, node];
        // Une feuille, ou un nœud sans enfant, termine la navigation.
        if (node.is_leaf || node.children.length === 0) {
            this.leafSelected.emit({ node, path: nextPath });
            return;
        }
        this.path = nextPath;
    };
    goTo = (index) => {
        this.path = this.path.slice(0, index);
    };
    render() {
        if (this.isLoading) {
            return (h(Host, null, h("div", { class: "tree-status" }, "Chargement des th\u00E8mes\u2026")));
        }
        if (this.error) {
            return (h(Host, null, h("div", { class: "tree-status tree-error" }, this.error, h("button", { type: "button", class: "tree-link", onClick: () => this.load() }, "R\u00E9essayer"), this.allowSkip && (h("button", { type: "button", class: "tree-link", onClick: () => this.skipRequested.emit() }, "Poser directement ma question")))));
        }
        const current = this.path[this.path.length - 1];
        return (h(Host, null, h("div", { class: "tree" }, this.path.length > 0 && (h("nav", { class: "tree-breadcrumb", "aria-label": "Fil d'Ariane" }, h("button", { type: "button", class: "crumb", onClick: () => this.goTo(0) }, "Th\u00E8mes"), this.path.map((node, index) => (h("span", { key: node.id, class: "crumb-group" }, h("span", { class: "crumb-sep", "aria-hidden": "true" }, "\u203A"), h("button", { type: "button", class: "crumb", onClick: () => this.goTo(index + 1), disabled: index === this.path.length - 1 }, node.label)))))), h("p", { class: "tree-prompt" }, current ? current.label : 'Sur quel sujet portez-vous votre demande ?'), h("div", { class: "tree-options" }, this.options.map(node => (h("button", { key: node.id, type: "button", class: "tree-option", onClick: () => this.select(node) }, h("span", { class: "option-label" }, node.label), node.description && h("span", { class: "option-description" }, node.description))))), h("div", { class: "tree-footer" }, this.path.length > 0 && (h("button", { type: "button", class: "tree-link", onClick: () => this.goTo(this.path.length - 1) }, "\u2190 Retour")), this.allowSkip && (h("button", { type: "button", class: "tree-link tree-skip", onClick: () => this.skipRequested.emit() }, "Poser directement ma question"))))));
    }
    static get style() { return decisionTreeNavCss; }
}, [257, "decision-tree-nav", {
        "apiEndpoint": [1, "api-endpoint"],
        "allowSkip": [4, "allow-skip"],
        "nodes": [32],
        "path": [32],
        "isLoading": [32],
        "error": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["decision-tree-nav"];
    components.forEach(tagName => { switch (tagName) {
        case "decision-tree-nav":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, DecisionTreeNav);
            }
            break;
    } });
}
defineCustomElement();

export { DecisionTreeNav as D, defineCustomElement as d };
//# sourceMappingURL=p-DQs1oGKw.js.map

//# sourceMappingURL=p-DQs1oGKw.js.map