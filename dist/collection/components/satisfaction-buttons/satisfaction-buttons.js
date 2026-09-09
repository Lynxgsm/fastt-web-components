import { Env, Host, h } from "@stencil/core";
import { handleMessageFeedback, DEFAULT_API_ENDPOINT } from "../../utils/api-service";
import { satisfactionStateService } from "../../utils/satisfaction-state";
export class SatisfactionButtons {
    apiEndpoint = Env.API_URL || DEFAULT_API_ENDPOINT;
    messageId = '';
    selectedButton = null;
    unsubscribe = null;
    componentDidLoad() {
        // Initialize state from service
        this.selectedButton = satisfactionStateService.getState(this.messageId);
        // Subscribe to state changes
        this.unsubscribe = satisfactionStateService.subscribe(this.messageId, state => {
            this.selectedButton = state;
        });
    }
    disconnectedCallback() {
        // Clean up subscription
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
    handleThumbsUp = () => {
        satisfactionStateService.setState(this.messageId, 'up');
        handleMessageFeedback(1, this.apiEndpoint, this.messageId, () => {
            console.log('Thumbs up clicked');
        });
    };
    handleThumbsDown = () => {
        satisfactionStateService.setState(this.messageId, 'down');
        handleMessageFeedback(0, this.apiEndpoint, this.messageId, () => {
            console.log('Thumbs down clicked');
        });
    };
    render() {
        return (h(Host, { key: '8eac31d683410a9f8cf5d8649d0f949057ee4d90' }, h("div", { key: '964dd9419a8d5d2c411508a549d0f5e15c9e1ef5', class: "satisfaction-container" }, h("div", { key: 'be6e0cb40c5332a46d200bdb8a0dab4ba2e90123', class: "satisfaction-buttons" }, h("button", { key: '0344318fea1bb6dfedd5991106f115cb63ef32c4', title: "R\u00E9ponse utile", class: `satisfaction-btn thumbs-up ${this.selectedButton === 'up' ? 'active' : ''}`, onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: '8bf13c17df7deada8b44ad3f1a89ea7e630975d4', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'up' ? '#ff8834' : 'none', stroke: this.selectedButton === 'up' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '01b60a3de497dddc243b0c00d02ef3fac57b5821', d: "M7 10v12" }), h("path", { key: 'b488811ed25377fbe70052a0147343eb1874b798', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '57b27ae83b12f1c9cda13c800f54d3dd32ee10e8', title: "R\u00E9ponse inutile", class: `satisfaction-btn thumbs-down ${this.selectedButton === 'down' ? 'active' : ''}`, onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: '4f056f85fe36821d0a309d5526a65e33e5ebdec8', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'down' ? '#ff8834' : 'none', stroke: this.selectedButton === 'down' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: 'e460dda1cd1bf63c529940ef32ebfd343ecb6b1d', d: "M17 14V2" }), h("path", { key: '97f24103d9cfb1928d9cda39d7f18db96ca6a9b6', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
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
                "defaultValue": "Env.API_URL || DEFAULT_API_ENDPOINT"
            },
            "messageId": {
                "type": "string",
                "attribute": "message-id",
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
    static get states() {
        return {
            "selectedButton": {}
        };
    }
}
//# sourceMappingURL=satisfaction-buttons.js.map
