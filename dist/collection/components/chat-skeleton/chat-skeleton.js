import { Host, h } from "@stencil/core";
export class ChatSkeleton {
    render() {
        return (h(Host, { key: '44f75e135dd6132ea901e52ef247365da6a42527' }, h("div", { key: '9c959b494f3b0ad736dbd8ec86df47124670e27d', class: 'skeleton-container' }, h("div", { key: '010f1c559187331c5e49d0b6b8f619fe82fcd61f', class: 'skeleton-typing' }, h("div", { key: 'f82b749c6fd9f63ac35b6a9d12f03ea18cc5e4d2', class: 'skeleton-dot' }), h("div", { key: 'e7e19ec93d3e9f24d6ebc693d7a9b5d2f42a7305', class: 'skeleton-dot' })))));
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
