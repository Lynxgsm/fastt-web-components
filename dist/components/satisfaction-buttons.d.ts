import type { Components, JSX } from "../types/components";

interface SatisfactionButtons extends Components.SatisfactionButtons, HTMLElement {}
export const SatisfactionButtons: {
    prototype: SatisfactionButtons;
    new (): SatisfactionButtons;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
