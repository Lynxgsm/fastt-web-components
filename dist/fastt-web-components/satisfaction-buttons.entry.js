import { r as registerInstance, E as Env, h, a as Host } from './index-BKKbgT-O.js';
import { h as handleMessageFeedback } from './api-service-BUqu-bxk.js';

class SatisfactionStateService {
    state = new Map();
    listeners = new Map();
    setState(messageId, state) {
        this.state.set(messageId, state);
        this.notifyListeners(messageId, state);
    }
    getState(messageId) {
        return this.state.get(messageId) || null;
    }
    subscribe(messageId, callback) {
        if (!this.listeners.has(messageId)) {
            this.listeners.set(messageId, new Set());
        }
        this.listeners.get(messageId).add(callback);
        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(messageId);
            if (listeners) {
                listeners.delete(callback);
                if (listeners.size === 0) {
                    this.listeners.delete(messageId);
                }
            }
        };
    }
    notifyListeners(messageId, state) {
        const listeners = this.listeners.get(messageId);
        if (listeners) {
            listeners.forEach(callback => callback(state));
        }
    }
}
const satisfactionStateService = new SatisfactionStateService();

const satisfactionButtonsCss = ":host{display:block !important;visibility:visible !important;height:auto !important;box-sizing:border-box;--btn-size:18px}button{all:unset}.satisfaction-container{gap:8px;margin-top:12px;padding:12px;width:100%;box-sizing:border-box}.satisfaction-buttons{display:flex !important;gap:8px;align-items:flex-start;justify-content:flex-start;width:100%}.satisfaction-btn{background:transparent !important;width:var(--btn-size) !important;height:var(--btn-size) !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;transition:all 0.2s ease !important;padding:0 !important;box-sizing:border-box !important;color:#6b7280 !important}.satisfaction-btn.active{color:#059669 !important}.satisfaction-btn.active.thumbs-down{color:#dc2626 !important}.satisfaction-btn svg{width:24px !important;height:24px !important}:host *{box-sizing:border-box !important}.satisfaction-btn,.satisfaction-btn:hover,.satisfaction-btn:active,.satisfaction-btn:focus{opacity:1 !important;visibility:visible !important}";

const SatisfactionButtons = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
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
        return (h(Host, { key: '6814eb8d6cb25abb38396b831703e18e80b7e683' }, h("div", { key: '1344664c0c7127070550ec6f1f00dd336caa716b', class: "satisfaction-container" }, h("div", { key: '8377fc7d404c779a9c63947e22107f4a30c3ac46', class: "satisfaction-buttons" }, h("button", { key: '2106dcab7362893326aa9a069d1801983afea0ac', title: "R\u00E9ponse utile", class: `satisfaction-btn thumbs-up ${this.selectedButton === 'up' ? 'active' : ''}`, onClick: this.handleThumbsUp, "aria-label": "R\u00E9ponse utile" }, h("svg", { key: 'bf0cb3f1e269d01d7817c15b04928d978ec99385', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'up' ? '#ff8834' : 'none', stroke: this.selectedButton === 'up' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-up-icon lucide-thumbs-up" }, h("path", { key: '60dfe4f70c27cffcef05eb5bfa8ada6c5590e03f', d: "M7 10v12" }), h("path", { key: 'abed8de9467189778a37217b116636ae7bb7dc47', d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" }))), h("button", { key: '3c2f743be275ad0205e5f2f5cdabef36e7721fdf', title: "R\u00E9ponse inutile", class: `satisfaction-btn thumbs-down ${this.selectedButton === 'down' ? 'active' : ''}`, onClick: this.handleThumbsDown, "aria-label": "R\u00E9ponse pas utile" }, h("svg", { key: '853f3fef3e9cee4a92207a83bf6d0d7203e92c3c', xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: this.selectedButton === 'down' ? '#ff8834' : 'none', stroke: this.selectedButton === 'down' ? '#ff8834' : 'currentColor', "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "lucide lucide-thumbs-down-icon lucide-thumbs-down" }, h("path", { key: '1cfe06fbc0b01d7cf83ae21e5651bb81557374bd', d: "M17 14V2" }), h("path", { key: '0a83340f3b2db880e21252f2d294ca5eeebdc577', d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" })))))));
    }
};
SatisfactionButtons.style = satisfactionButtonsCss;

export { SatisfactionButtons as satisfaction_buttons };
//# sourceMappingURL=satisfaction-buttons.entry.esm.js.map

//# sourceMappingURL=satisfaction-buttons.entry.js.map