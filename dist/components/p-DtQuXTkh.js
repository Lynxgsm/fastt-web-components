import { p as proxyCustomElement, H, h, a as Host } from './index.js';

const satisfactionButtonsCss = ":host{display:block}";

const SatisfactionButtons = /*@__PURE__*/ proxyCustomElement(class SatisfactionButtons extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: 'e56f4f726bcc459c89e8977f04476b00a5fcd74e' }, h("slot", { key: '885a78c0da5410eaa0d6e06ff7ea311685f16e6c' })));
    }
    static get style() { return satisfactionButtonsCss; }
}, [257, "satisfaction-buttons"]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["satisfaction-buttons"];
    components.forEach(tagName => { switch (tagName) {
        case "satisfaction-buttons":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SatisfactionButtons);
            }
            break;
    } });
}
defineCustomElement();

export { SatisfactionButtons as S, defineCustomElement as d };
//# sourceMappingURL=p-DtQuXTkh.js.map

//# sourceMappingURL=p-DtQuXTkh.js.map