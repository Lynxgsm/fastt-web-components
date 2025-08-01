import { Host, h } from "@stencil/core";
export class ChatSkeleton {
    render() {
        return (h(Host, { key: '2096c995089506157a76f0cf46cc0438202c388d' }, h("div", { key: 'ce78a4d4ef5aff3c73baa7721fee1ddd1cb41d24', class: 'skeleton-container' }, h("div", { key: '23473a136acc8ad67d870c804ccf78294e64221e', class: 'skeleton-typing' }, h("div", { key: '736709a3c4355b60b738073a2b30916a78a1a731', class: 'skeleton-dot' }), h("div", { key: 'e32141d131bc8fee237b5d50ea3a6bd65ee31caf', class: 'skeleton-dot' })))));
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
