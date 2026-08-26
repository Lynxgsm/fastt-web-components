import { p as proxyCustomElement, H, E as Env, h, a as Host } from './index.js';
import { l as loadFonts } from './p-YkBWLiCr.js';
import { d as defineCustomElement$3 } from './p-DzPlibQP.js';
import { d as defineCustomElement$2 } from './p-B5EiGtoA.js';

const chatModalCss = ":host{--main-color:#ff8834;font-family:'Yantramanav', serif, Arial, sans-serif;line-height:1.5;font-weight:400;display:block;height:100%}.chat-container{width:100%;height:100%;background:white;border-radius:12px;display:flex;flex-direction:column;gap:12px;padding-bottom:16px;border:1px solid #eee;box-sizing:border-box;overflow:hidden}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:18px 24px;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border-radius:12px 12px 0 0}.modal-title{font-family:'Signika', Arial, sans-serif;font-size:1.25rem;font-weight:600;margin:0}chat-conversation{flex:1;min-height:0;padding:0 16px}";

const ChatModal$1 = /*@__PURE__*/ proxyCustomElement(class ChatModal extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    modalTitle = 'Que puis-je faire pour vous ?';
    apiEndpoint = Env.API_URL;
    componentWillLoad() {
        loadFonts();
    }
    render() {
        return (h(Host, { key: '5aa2acfee138a0dbef25178aecd13ed86903a5ef' }, h("div", { key: '27f80db81f9b495e4a59e61d4c884c24fea24dad', class: "chat-container" }, h("div", { key: '180a2b71752719cab1608628a7c6656b827ac672', class: "modal-header" }, h("span", { key: '9255783b33abbe32e93ebb74266941b47d8582fb', class: "modal-title" }, this.modalTitle)), h("chat-conversation", { key: 'da3d6906f103522c47c399b658c71a112ff5f30d', apiEndpoint: this.apiEndpoint }))));
    }
    static get style() { return chatModalCss; }
}, [257, "chat-modal", {
        "modalTitle": [1, "modal-title"],
        "apiEndpoint": [1, "api-endpoint"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["chat-modal", "chat-conversation", "chat-skeleton"];
    components.forEach(tagName => { switch (tagName) {
        case "chat-modal":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ChatModal$1);
            }
            break;
        case "chat-conversation":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "chat-skeleton":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}
defineCustomElement$1();

const ChatModal = ChatModal$1;
const defineCustomElement = defineCustomElement$1;

export { ChatModal, defineCustomElement };
//# sourceMappingURL=chat-modal.js.map

//# sourceMappingURL=chat-modal.js.map