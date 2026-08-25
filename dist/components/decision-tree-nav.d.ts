import type { Components, JSX } from "../types/components";

interface DecisionTreeNav extends Components.DecisionTreeNav, HTMLElement {}
export const DecisionTreeNav: {
    prototype: DecisionTreeNav;
    new (): DecisionTreeNav;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
