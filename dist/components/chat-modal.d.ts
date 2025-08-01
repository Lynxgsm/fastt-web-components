import type { Components, JSX } from "../types/components";

interface ChatModal extends Components.ChatModal, HTMLElement {}
export const ChatModal: {
    prototype: ChatModal;
    new (): ChatModal;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
