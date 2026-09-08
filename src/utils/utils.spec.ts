import { generateConversationId, generateMessageId } from './utils';

describe('generateConversationId', () => {
  it('préfixe par conv_ et sépare horodatage et aléa', () => {
    expect(generateConversationId()).toMatch(/^conv_\d+_[a-z0-9]+$/);
  });

  it('ne se répète pas sur des appels successifs', () => {
    // L'horodatage seul ne distingue pas deux appels dans la même
    // milliseconde : c'est la partie aléatoire qui doit s'en charger.
    const ids = new Set(Array.from({ length: 500 }, () => generateConversationId()));
    expect(ids.size).toBe(500);
  });
});

describe('generateMessageId', () => {
  it('préfixe par msg_ et sépare horodatage et aléa', () => {
    expect(generateMessageId()).toMatch(/^msg_\d+_[a-z0-9]+$/);
  });

  it('ne se répète pas sur des appels successifs', () => {
    const ids = new Set(Array.from({ length: 500 }, () => generateMessageId()));
    expect(ids.size).toBe(500);
  });

  it('ne peut pas être confondu avec un identifiant de conversation', () => {
    // Les deux circulent côté API (`conversation_id` et `message_id`) : les
    // préfixes doivent rester distincts.
    expect(generateMessageId().startsWith('msg_')).toBe(true);
    expect(generateConversationId().startsWith('conv_')).toBe(true);
  });
});
