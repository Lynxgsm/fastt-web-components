import { r as registerInstance, h, a as Host } from './index-BKKbgT-O.js';

const chatSkeletonCss = ":host{display:block}@keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}.skeleton-container{position:relative}.skeleton-line{height:14px;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;border-radius:4px;margin-bottom:8px;position:relative;overflow:hidden}.skeleton-line:last-child{margin-bottom:0}.skeleton-line.line-1{width:95%}.skeleton-line.line-2{width:88%}.skeleton-line.line-3{width:72%}.skeleton-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);background-size:200px 100%;animation:shimmer 1.5s infinite linear;margin-bottom:12px;display:inline-block}.skeleton-wrapper{display:flex;align-items:flex-start;gap:12px}.skeleton-content{flex:1}.skeleton-typing{display:flex;align-items:center;gap:4px;margin-top:8px}.skeleton-dot{width:6px;height:6px;border-radius:50%;background-color:#6c757d;animation:typing 1.4s infinite ease-in-out}.skeleton-dot:nth-child(1){animation-delay:-0.32s}.skeleton-dot:nth-child(2){animation-delay:-0.16s}.skeleton-dot:nth-child(3){animation-delay:0s}@keyframes typing{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}.skeleton-glow{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);animation:glow 2s infinite;border-radius:inherit}@keyframes glow{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}";

const ChatSkeleton = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        return (h(Host, { key: 'ebdf437a8d516e0e27516e505a65c5702ae33f4b' }, h("div", { key: 'c1b212392b3ab4f8266da7a9f584fec3092424ea', class: 'skeleton-container' }, h("div", { key: 'df3f4db997842505bc17545233eef3e8e036f952', class: 'skeleton-typing' }, h("div", { key: '6b4f9796edd6243865e65c31e399eaf38054372c', class: 'skeleton-dot' }), h("div", { key: '2f0be9e8816c203079b8b2697574ac22d49f07a7', class: 'skeleton-dot' })))));
    }
};
ChatSkeleton.style = chatSkeletonCss;

export { ChatSkeleton as chat_skeleton };
//# sourceMappingURL=chat-skeleton.entry.esm.js.map

//# sourceMappingURL=chat-skeleton.entry.js.map