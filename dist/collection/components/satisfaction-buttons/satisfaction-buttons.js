import { Env, Host, h } from "@stencil/core";
import { handleMessageFeedback } from "../../utils/api-service";
import { satisfactionStateService } from "../../utils/satisfaction-state";
export class SatisfactionButtons {
    apiEndpoint = (Env.API_URL = 'https://fastt.celaneo.com');
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
        return (h(Host, { key: 'd4ebe6e85f8dd4441b2afadae429c08ad9df16fe' }, h("div", { key: 'fea4ec050ce3d6808b13f0cc4f39819db9a9167b', class: "satisfaction-container" }, h("div", { key: '942733373cc4bd36a921b53b3091f2540accedf4', class: "satisfaction-buttons" }, h("button", { key: '79c3b9b58734fb80bc3ae25701676164db7e8cb8', title: "R\u00E9ponse utile", class: `satisfaction-btn thumbs-up ${this.selectedButton === 'up' ? 'active' : ''}`, onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: 'd1f69734f7872bed204ceeb27a2c80c2021150e5', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'up' ? '#ff8834' : 'none', stroke: this.selectedButton === 'up' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '8842229d6499169d7425c2bbea78f26d61c78b7c', d: "M7 10v12" }), h("path", { key: 'f8d569ed5bc4a703b0f9aba55754feb92c65d81d', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '9537896f5f742df0dd96eb37b250846724f6f1f7', title: "R\u00E9ponse inutile", class: `satisfaction-btn thumbs-down ${this.selectedButton === 'down' ? 'active' : ''}`, onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: 'c69fd8461052c1e336e0eddd04a63ec7bf6ee0ff', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'down' ? '#ff8834' : 'none', stroke: this.selectedButton === 'down' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '2def566636fd48dfbe77c04ec045832551828e5d', d: "M17 14V2" }), h("path", { key: '538bf1d23a7d3ddba3ef3f91d9220c11d54209b2', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
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
                "defaultValue": "(Env.API_URL = 'https://fastt.celaneo.com')"
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
