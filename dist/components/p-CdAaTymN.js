import { p as proxyCustomElement, H, h, a as Host } from './index.js';

const chatSkeletonCss = ":host{display:block}@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}.skeleton-container{position:relative}.skeleton-line{height:14px;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;border-radius:4px;margin-bottom:8px;position:relative;overflow:hidden}.skeleton-line:last-child{margin-bottom:0}.skeleton-line.line-1{width:95%}.skeleton-line.line-2{width:88%}.skeleton-line.line-3{width:72%}.skeleton-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;margin-bottom:12px;display:inline-block}.skeleton-wrapper{display:flex;align-items:flex-start;gap:12px}.skeleton-content{flex:1}.skeleton-typing{display:flex;align-items:center;gap:4px;margin-top:8px}.skeleton-dot{width:6px;height:6px;border-radius:50%;background-color:#6c757d;animation:typing 1.4s infinite ease-in-out}.skeleton-dot:nth-child(1){animation-delay:-0.32s}.skeleton-dot:nth-child(2){animation-delay:-0.16s}.skeleton-dot:nth-child(3){animation-delay:0s}@keyframes typing{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}.skeleton-glow{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);animation:glow 2s infinite;border-radius:inherit}@keyframes glow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}";

const ChatSkeleton = /*@__PURE__*/ proxyCustomElement(class ChatSkeleton extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: 'bdd4d9caa9a70feb30f9a5d614693e13d8e90766' }, h("div", { key: '25a58430b59cbfc4274600d9bce09f32bfd90399', class: 'skeleton-container' }, h("div", { key: '24f68cdc75130deddb5262a7c31bc0efee18f2a8', class: 'skeleton-typing' }, h("div", { key: 'f1d5eaf22fb6b6b2b481bd438afc8dfddaa6a61e', class: 'skeleton-dot' }), h("div", { key: 'f65f54b658580f831b230478256c54bb908af1a7', class: 'skeleton-dot' })))));
    }
    static get style() { return chatSkeletonCss; }
}, [257, "chat-skeleton"]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["chat-skeleton"];
    components.forEach(tagName => { switch (tagName) {
        case "chat-skeleton":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ChatSkeleton);
            }
            break;
    } });
}
defineCustomElement();

export { ChatSkeleton as C, defineCustomElement as d };
//# sourceMappingURL=p-CdAaTymN.js.map

//# sourceMappingURL=p-CdAaTymN.js.map