import { Env, Host, h } from "@stencil/core";
import { handleFeedback } from "../../utils/api-service";
import { satisfactionStateService } from "../../utils/satisfaction-state";
export class SatisfactionButtons {
    apiEndpoint = (Env.API_URL = 'https://fastt.celaneo.com');
    conversationId = '';
    selectedButton = null;
    unsubscribe = null;
    componentDidLoad() {
        // Initialize state from service
        this.selectedButton = satisfactionStateService.getState(this.conversationId);
        // Subscribe to state changes
        this.unsubscribe = satisfactionStateService.subscribe(this.conversationId, state => {
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
        satisfactionStateService.setState(this.conversationId, 'up');
        handleFeedback(1, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs up clicked');
        });
    };
    handleThumbsDown = () => {
        satisfactionStateService.setState(this.conversationId, 'down');
        handleFeedback(0, this.apiEndpoint, this.conversationId, () => {
            console.log('Thumbs down clicked');
        });
    };
    render() {
        return (h(Host, { key: '8ab94d482d02d447ad420170a8ea5e370c742b6d' }, h("div", { key: 'cb84d0e8e4a4ad503e3d1a2594b8d5d7bad83fe1', class: "satisfaction-container" }, h("div", { key: '601cb432223837c4fdb42a675f1b2c31a6457319', class: "satisfaction-buttons" }, h("button", { key: '000e5443a1d544851261682ac1711d0d7eaaa914', title: "R\u00E9ponse utile", class: `satisfaction-btn thumbs-up ${this.selectedButton === 'up' ? 'active' : ''}`, onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: '50b22481b7cf901caf12860b41834f9362f9560c', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'up' ? '#ff8834' : 'none', stroke: this.selectedButton === 'up' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '1797fb6e93a0d5603e9b3020b93cbe6983ebb10b', d: "M7 10v12" }), h("path", { key: '993aa0a58d8113a02067b2b8c3bf571fea02eadd', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '3162e50bda221674c67716776721a5dc314765bb', title: "R\u00E9ponse inutile", class: `satisfaction-btn thumbs-down ${this.selectedButton === 'down' ? 'active' : ''}`, onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: 'b4966a5e80b1a36f498a561abb099e679c9892b5', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'down' ? '#ff8834' : 'none', stroke: this.selectedButton === 'down' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '0ef105f91663cc6f1791cc12d8a338b2a98fa098', d: "M17 14V2" }), h("path", { key: 'a97c165419a3c031635cc04261c31f63cc13ea70', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
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
    static get states() {
        return {
            "selectedButton": {}
        };
    }
}
//# sourceMappingURL=satisfaction-buttons.js.map
