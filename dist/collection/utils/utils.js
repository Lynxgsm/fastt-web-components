/**
 * Generates a unique conversation ID
 * @returns A unique string identifier for conversations
 */
export function generateConversationId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `conv_${timestamp}_${random}`;
}
/**
 * Generates a unique message ID
 * @returns A unique string identifier for messages
 */
export function generateMessageId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `msg_${timestamp}_${random}`;
}
//# sourceMappingURL=utils.js.map
