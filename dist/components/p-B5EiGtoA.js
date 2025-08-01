import { p as proxyCustomElement, H, h, a as Host } from './index.js';

const chatSkeletonCss = ":host{display:block}@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}.skeleton-container{position:relative}.skeleton-line{height:14px;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;border-radius:4px;margin-bottom:8px;position:relative;overflow:hidden}.skeleton-line:last-child{margin-bottom:0}.skeleton-line.line-1{width:95%}.skeleton-line.line-2{width:88%}.skeleton-line.line-3{width:72%}.skeleton-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;margin-bottom:12px;display:inline-block}.skeleton-wrapper{display:flex;align-items:flex-start;gap:12px}.skeleton-content{flex:1}.skeleton-typing{display:flex;align-items:center;gap:4px;margin-top:8px}.skeleton-dot{width:6px;height:6px;border-radius:50%;background-color:#6c757d;animation:typing 1.4s infinite ease-in-out}.skeleton-dot:nth-child(1){animation-delay:-0.32s}.skeleton-dot:nth-child(2){animation-delay:-0.16s}.skeleton-dot:nth-child(3){animation-delay:0s}@keyframes typing{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}.skeleton-glow{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);animation:glow 2s infinite;border-radius:inherit}@keyframes glow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}";

const ChatSkeleton = /*@__PURE__*/ proxyCustomElement(class ChatSkeleton extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: '2096c995089506157a76f0cf46cc0438202c388d' }, h("div", { key: 'ce78a4d4ef5aff3c73baa7721fee1ddd1cb41d24', class: 'skeleton-container' }, h("div", { key: '23473a136acc8ad67d870c804ccf78294e64221e', class: 'skeleton-typing' }, h("div", { key: '736709a3c4355b60b738073a2b30916a78a1a731', class: 'skeleton-dot' }), h("div", { key: 'e32141d131bc8fee237b5d50ea3a6bd65ee31caf', class: 'skeleton-dot' })))));
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
//# sourceMappingURL=p-B5EiGtoA.js.map

//# sourceMappingURL=p-B5EiGtoA.js.map