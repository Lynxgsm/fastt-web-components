import { Host, h } from "@stencil/core";
import { fetchDecisionTree } from "../../utils/api-service";
/**
 * Navigation guidée : l'utilisateur descend l'arbre de décision jusqu'à une
 * feuille avant de pouvoir poser sa question. Le niveau 1 fournit le
 * regroupement par thème.
 */
export class DecisionTreeNav {
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
    static get is() { return "decision-tree-nav"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["decision-tree-nav.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["decision-tree-nav.css"]
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
                "defaultValue": "''"
            },
            "allowSkip": {
                "type": "boolean",
                "attribute": "allow-skip",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Permet de sauter l'arbre et d'interroger l'ensemble du corpus FASTT."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "true"
            }
        };
    }
    static get states() {
        return {
            "nodes": {},
            "path": {},
            "isLoading": {},
            "error": {}
        };
    }
    static get events() {
        return [{
                "method": "leafSelected",
                "name": "leafSelected",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "\u00C9mis quand une feuille est atteinte : le chat peut s'ouvrir."
                },
                "complexType": {
                    "original": "{ node: DecisionNode; path: DecisionNode[] }",
                    "resolved": "{ node: DecisionNode; path: DecisionNode[]; }",
                    "references": {
                        "DecisionNode": {
                            "location": "import",
                            "path": "../../utils/api-service",
                            "id": "src/utils/api-service.ts::DecisionNode"
                        }
                    }
                }
            }, {
                "method": "skipRequested",
                "name": "skipRequested",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "\u00C9mis quand l'utilisateur choisit de poser directement sa question."
                },
                "complexType": {
                    "original": "void",
                    "resolved": "void",
                    "references": {}
                }
            }];
    }
}
//# sourceMappingURL=decision-tree-nav.js.map
