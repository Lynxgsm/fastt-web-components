import { generateConversationId, generateMessageId } from './utils';

describe('identifiants', () => {
  it('génère des identifiants de conversation préfixés et uniques', () => {
    const a = generateConversationId();
    expect(a).toMatch(/^conv_/);
    expect(a).not.toEqual(generateConversationId());
  });

  it('génère des identifiants de message préfixés et uniques', () => {
    const a = generateMessageId();
    expect(a).toMatch(/^msg_/);
    expect(a).not.toEqual(generateMessageId());
  });
});
