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
        return (h(Host, { key: 'd223b432dd5217500238eebd6f3fb267b8470718' }, h("div", { key: '258ad03d6340909d1ef3c80045151fea906f829a', class: "satisfaction-container" }, h("div", { key: 'c429f8805dd4a78004d300f0183dffd4d07ede00', class: "satisfaction-buttons" }, h("button", { key: 'fac769701df8bb25a2f38d59474810543e97f81f', title: "R\u00E9ponse utile", class: "satisfaction-btn thumbs-up", onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: '00e444c10cac2b694521b0174a83307e3fe7c665', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '66d859d5e77e0912b86a564b2e0b196cf3fee77c', d: "M7 10v12" }), h("path", { key: 'cb65671c324d90c604d0cb43e0381c3b4b6df97c', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '4bc0cf5703797b22e14b803e6d4f17711d17b28f', title: "R\u00E9ponse inutile", class: "satisfaction-btn thumbs-down", onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: '3afa6cb18e8889ef53e6b6e54eaefe246f272396', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '84a93585229934986abc3e916ee1786b4db3758a', d: "M17 14V2" }), h("path", { key: 'e318a1ae49c822f8518d75ccfeb57b70a7e9cf1a', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
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
