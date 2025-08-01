import type { Components, JSX } from "../types/components";

interface ChatSkeleton extends Components.ChatSkeleton, HTMLElement {}
export const ChatSkeleton: {
    prototype: ChatSkeleton;
    new (): ChatSkeleton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
