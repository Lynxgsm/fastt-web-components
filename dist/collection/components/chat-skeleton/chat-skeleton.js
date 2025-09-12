import { Host, h } from "@stencil/core";
export class ChatSkeleton {
    render() {
        return (h(Host, { key: 'ebdf437a8d516e0e27516e505a65c5702ae33f4b' }, h("div", { key: 'c1b212392b3ab4f8266da7a9f584fec3092424ea', class: 'skeleton-container' }, h("div", { key: 'df3f4db997842505bc17545233eef3e8e036f952', class: 'skeleton-typing' }, h("div", { key: '6b4f9796edd6243865e65c31e399eaf38054372c', class: 'skeleton-dot' }), h("div", { key: '2f0be9e8816c203079b8b2697574ac22d49f07a7', class: 'skeleton-dot' })))));
    }
    static get is() { return "chat-skeleton"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["chat-skeleton.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["chat-skeleton.css"]
        };
    }
}
//# sourceMappingURL=chat-skeleton.js.map
