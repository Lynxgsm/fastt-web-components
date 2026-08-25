import { Host, h } from "@stencil/core";
export class ChatSkeleton {
    render() {
        return (h(Host, { key: 'bdd4d9caa9a70feb30f9a5d614693e13d8e90766' }, h("div", { key: '25a58430b59cbfc4274600d9bce09f32bfd90399', class: 'skeleton-container' }, h("div", { key: '24f68cdc75130deddb5262a7c31bc0efee18f2a8', class: 'skeleton-typing' }, h("div", { key: 'f1d5eaf22fb6b6b2b481bd438afc8dfddaa6a61e', class: 'skeleton-dot' }), h("div", { key: 'f65f54b658580f831b230478256c54bb908af1a7', class: 'skeleton-dot' })))));
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
