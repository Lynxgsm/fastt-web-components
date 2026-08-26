import { r as registerInstance, E as Env, h, a as Host } from './index-DeNA3EAZ.js';
import { l as loadFonts } from './fonts-YkBWLiCr.js';

const chatModalCss = ":host{--main-color:#ff8834;font-family:'Yantramanav', serif, Arial, sans-serif;line-height:1.5;font-weight:400;display:block;height:100%}.chat-container{width:100%;height:100%;max-height:var(--chat-max-height, min(520px, 70vh));background:white;border-radius:12px;display:flex;flex-direction:column;gap:12px;padding-bottom:16px;border:1px solid #eee;box-sizing:border-box;overflow:hidden}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:18px 24px;background:linear-gradient(135deg, var(--main-color), #ff8834);color:white;border-radius:12px 12px 0 0}.modal-title{font-family:'Signika', Arial, sans-serif;font-size:1.25rem;font-weight:600;margin:0}chat-conversation{flex:1;min-height:0;padding:0 16px}";

const ChatModal = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    modalTitle = 'Que puis-je faire pour vous ?';
    apiEndpoint = Env.API_URL;
    componentWillLoad() {
        loadFonts();
    }
    render() {
        return (h(Host, { key: '5aa2acfee138a0dbef25178aecd13ed86903a5ef' }, h("div", { key: '27f80db81f9b495e4a59e61d4c884c24fea24dad', class: "chat-container" }, h("div", { key: '180a2b71752719cab1608628a7c6656b827ac672', class: "modal-header" }, h("span", { key: '9255783b33abbe32e93ebb74266941b47d8582fb', class: "modal-title" }, this.modalTitle)), h("chat-conversation", { key: 'da3d6906f103522c47c399b658c71a112ff5f30d', apiEndpoint: this.apiEndpoint }))));
    }
};
ChatModal.style = chatModalCss;

export { ChatModal as chat_modal };
//# sourceMappingURL=chat-modal.entry.esm.js.map

//# sourceMappingURL=chat-modal.entry.js.map