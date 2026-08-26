import { p as proxyCustomElement, H, E as Env, h } from './index.js';
import { l as loadFonts } from './p-YkBWLiCr.js';
import { d as defineCustomElement$3 } from './p-DzPlibQP.js';
import { d as defineCustomElement$2 } from './p-B5EiGtoA.js';

const chatWidgetCss = ":host{max-width:600px;margin:0 auto;padding:20px;--main-color:#ff8834;font-family:'Yantramanav', serif, Arial, sans-serif}.chat-widget-container{position:fixed;bottom:10vh;right:24px;width:350px;background:white;border-radius:12px;box-shadow:0 2px 16px rgba(0, 0, 0, 0.15);z-index:999;display:flex;flex-direction:column;overflow:hidden}.chat-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;background:var(--main-color);color:white;font-family:'Signika', Arial, sans-serif}.chat-title{margin:0;font-size:1.1rem;font-weight:600}.close-button{background:none;border:none;color:white;font-size:1.5rem;cursor:pointer}.chat-toggler{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:var(--main-color);color:white;border:none;box-shadow:0 2px 8px rgba(0, 0, 0, 0.15);display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;z-index:999}.hide{display:none;opacity:0;z-index:-1;transform:translateY(50%)}chat-conversation{flex:1;min-height:0;padding:0 12px 12px}";

const ChatWidget$1 = /*@__PURE__*/ proxyCustomElement(class ChatWidget extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
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
    static get style() { return chatWidgetCss; }
}, [257, "chat-widget", {
        "apiEndpoint": [1, "api-endpoint"],
        "isChatContainerVisible": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["chat-widget", "chat-conversation", "chat-skeleton"];
    components.forEach(tagName => { switch (tagName) {
        case "chat-widget":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ChatWidget$1);
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

const ChatWidget = ChatWidget$1;
const defineCustomElement = defineCustomElement$1;

export { ChatWidget, defineCustomElement };
//# sourceMappingURL=chat-widget.js.map

//# sourceMappingURL=chat-widget.js.map