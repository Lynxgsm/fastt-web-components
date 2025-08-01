import { p as proxyCustomElement, H, h, a as Host } from './p-2fbjSrKn.js';

const satisfactionButtonsCss = ":host{display:block}";

const SatisfactionButtons = /*@__PURE__*/ proxyCustomElement(class SatisfactionButtons extends H {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
    }
    render() {
        return (h(Host, { key: 'e78973a053039f884786845b8382a4d75d928a0b' }, h("slot", { key: '5166e2afcf028ca37962cee330f61b50f0e74bff' })));
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
//# sourceMappingURL=p-DiDPZ0z6.js.map

//# sourceMappingURL=p-DiDPZ0z6.js.map