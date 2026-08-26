import type { Components, JSX } from "../types/components";

interface ChatConversation extends Components.ChatConversation, HTMLElement {}
export const ChatConversation: {
    prototype: ChatConversation;
    new (): ChatConversation;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
