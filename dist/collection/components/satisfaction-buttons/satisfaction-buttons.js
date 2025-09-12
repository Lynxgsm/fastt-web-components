import { Env, Host, h } from "@stencil/core";
import { handleFeedback } from "../../utils/api-service";
export class SatisfactionButtons {
    apiEndpoint = Env.API_URL;
    conversationId = '';
    handleThumbsUp = () => {
        handleFeedback(1, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs up clicked');
        });
    };
    handleThumbsDown = () => {
        handleFeedback(0, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs down clicked');
        });
    };
    render() {
        return (h(Host, { key: '78bebfd8537344847b87482f6f67205ae21b9045' }, h("div", { key: '018709cb2a0bc3f69b3d9980ef327fcad4b6eb06', class: "satisfaction-container" }, h("div", { key: '5115c40c47e426b0012217c57a4cbcb987511e44', class: "satisfaction-buttons" }, h("button", { key: 'ddacb33a1d6463f70fb488dd26ff6ae820ecb872', title: "R\u00E9ponse utile", class: "satisfaction-btn thumbs-up", onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: 'e68f92ccd7f61e4c231998b5a7e55ce91ebf8f6d', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '863866d5ebd637a2043bbacf7f9bdd9ded18a706', d: "M7 10v12" }), h("path", { key: '4945a4da9a5f33a1bd916ffd7676063b4d2c0c32', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: 'bc79b6aea875c7f4deee0ee0dfe59d4d2204fdd7', title: "R\u00E9ponse inutile", class: "satisfaction-btn thumbs-down", onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: '01a62ea2c9df93aa699e0edfb16642948e64f003', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '6f4ce94360d427f99834fecf62a0d440dc60efda', d: "M17 14V2" }), h("path", { key: 'f01d040bcd253cba4f6150a624f2747a65a97613', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
    }
    static get is() { return "satisfaction-buttons"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["satisfaction-buttons.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["satisfaction-buttons.css"]
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
            },
            "conversationId": {
                "type": "string",
                "attribute": "conversation-id",
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
            }
        };
    }
}
//# sourceMappingURL=satisfaction-buttons.js.map
