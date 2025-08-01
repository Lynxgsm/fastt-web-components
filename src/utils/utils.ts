/**
 * Generates a unique conversation ID
 * @returns A unique string identifier for conversations
 */
export function generateConversationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `conv_${timestamp}_${random}`;
}
