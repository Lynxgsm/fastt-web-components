import { Env, h } from "@stencil/core";
import { loadFonts } from "../../utils/fonts";
/**
 * Bulle flottante et son panneau.
 *
 * Ne porte que son chrome : le parcours vit dans `chat-conversation`, partagé
 * avec `chat-modal`.
 */
export class ChatWidget {
    apiEndpoint = Env.API_URL;
    isChatContainerVisible = true;
    componentWillLoad() {
        loadFonts();
    }
    toggle = () => {
        this.isChatContainerVisible = !this.isChatContainerVisible;
    };
    render() {
        return [
            h("div", { key: '1dec548284bad5f7e6f15290d8e4c766ca1013ee', class: { 'chat-widget-container': true, hide: !this.isChatContainerVisible } }, h("div", { key: 'e802e9c349f4157118a69c645b05f7d1ced1a461', class: "chat-header" }, h("h3", { key: 'b06d98e77897612cb7631549e776b844f4e08096', class: "chat-title" }, "Que puis-je faire pour vous ?"), h("button", { key: 'c48f543f4b232d270f5b18dc27f5e827ca5e6549', class: "close-button", onClick: this.toggle, "aria-label": "Fermer" }, "\u00D7")), h("chat-conversation", { key: '798effca8e6f911b950ca61c6788fbc2481630ba', apiEndpoint: this.apiEndpoint })),
            h("button", { key: 'e0c5c81e66c26b79617f25757a75341869dc114e', class: "chat-toggler", onClick: this.toggle, "aria-label": "Ouvrir le chat" }, h("svg", { key: '4d31fd0495901b02a16a9429e8b01b25efa442d3', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "white", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }, h("path", { key: '848499568e936cb5f9be66f5e79b6f0352f2157a', d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }))),
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
            "isChatContainerVisible": {}
        };
    }
}
//# sourceMappingURL=chat-widget.js.map
