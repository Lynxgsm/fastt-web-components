import type { Components, JSX } from "../types/components";

interface ChatWidget extends Components.ChatWidget, HTMLElement {}
export const ChatWidget: {
    prototype: ChatWidget;
    new (): ChatWidget;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
