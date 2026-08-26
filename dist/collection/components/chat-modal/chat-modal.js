import { Env, h, Host } from "@stencil/core";
import { loadFonts } from "../../utils/fonts";
/**
 * Panneau de chat intégré dans la page.
 *
 * Ne porte que son chrome : tout le parcours (arbre guidé, réponses
 * pré-enregistrées, vote, saisie libre) vit dans `chat-conversation`, partagé
 * avec `chat-widget`. Les deux composants étaient auparavant dupliqués à 90 %,
 * et leurs divergences étaient des bogues, pas des fonctionnalités.
 */
export class ChatModal {
    modalTitle = 'Que puis-je faire pour vous ?';
    apiEndpoint = Env.API_URL;
    componentWillLoad() {
        loadFonts();
    }
    render() {
        return (h(Host, { key: '5aa2acfee138a0dbef25178aecd13ed86903a5ef' }, h("div", { key: '27f80db81f9b495e4a59e61d4c884c24fea24dad', class: "chat-container" }, h("div", { key: '180a2b71752719cab1608628a7c6656b827ac672', class: "modal-header" }, h("span", { key: '9255783b33abbe32e93ebb74266941b47d8582fb', class: "modal-title" }, this.modalTitle)), h("chat-conversation", { key: 'da3d6906f103522c47c399b658c71a112ff5f30d', apiEndpoint: this.apiEndpoint }))));
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
}
//# sourceMappingURL=chat-modal.js.map
