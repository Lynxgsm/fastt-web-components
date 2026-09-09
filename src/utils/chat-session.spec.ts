import { resolveConversationId, restoreMessages, startNewConversation } from './chat-session';
import { loadConversationId, rememberSession } from './session-store';
import { satisfactionStateService } from './satisfaction-state';

function respondWith(status: number, body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    statusText: '',
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe('resolveConversationId', () => {
  beforeEach(() => window.localStorage.clear());

  it('ouvre une conversation neuve sans rien enregistrer', () => {
    const { id, restored } = resolveConversationId();

    expect(restored).toBe(false);
    expect(id).toMatch(/^conv_/);
    // Rien n'est persisté avant le premier message : l'API ne crée la conversation
    // qu'à cet instant, et un identifiant stocké trop tôt donnerait un 404 à la
    // relecture.
    expect(loadConversationId()).toBeNull();
  });

  it('ne se déclare pas « à restaurer » tant qu’aucun message n’a été envoyé', () => {
    resolveConversationId();
    resolveConversationId();

    // Deux montages successifs (deux composants, ou un rafraîchissement) sans
    // message : toujours rien à relire, donc aucun appel réseau à déclencher.
    expect(resolveConversationId().restored).toBe(false);
  });

  it('reprend la même conversation après un premier message', () => {
    const premier = resolveConversationId();
    rememberSession(premier.id);

    const second = resolveConversationId();

    expect(second.id).toBe(premier.id);
    expect(second.restored).toBe(true);
  });
});

describe('startNewConversation', () => {
  beforeEach(() => window.localStorage.clear());

  it('remplace la session par une autre, non rattachable à la précédente', () => {
    const ancien = resolveConversationId().id;
    rememberSession(ancien);

    const nouveau = startNewConversation();

    expect(nouveau).not.toBe(ancien);
    // L'ancienne est détachée, et la neuve n'est pas encore enregistrée : un
    // rechargement immédiat ne doit ramener ni l'une ni l'autre.
    expect(loadConversationId()).toBeNull();
    expect(resolveConversationId().restored).toBe(false);
  });
});

describe('restoreMessages', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });

  it('projette les messages de la base vers la forme des composants', async () => {
    respondWith(200, {
      messages: [
        { id: 1, actor: 'user', message: 'Bonjour', is_satisfied: null },
        { id: 2, actor: 'assistant', message: '**Bonjour**', is_satisfied: null },
      ],
    });

    const result = await restoreMessages('https://api.test', 'conv_1');

    expect(result).toEqual({
      status: 'restored',
      messages: [
        { role: 'user', content: 'Bonjour', isComplete: true, messageId: '1' },
        { role: 'ai', content: '**Bonjour**', isComplete: true, messageId: '2' },
      ],
    });
  });

  it('marque les messages restaurés comme terminés, pour que les pouces s’affichent', async () => {
    respondWith(200, { messages: [{ id: 7, actor: 'assistant', message: 'Réponse', is_satisfied: null }] });

    const result = await restoreMessages('https://api.test', 'conv_1');

    expect(result.status).toBe('restored');
    // `isComplete` conditionne le rendu de <satisfaction-buttons> dans les deux
    // composants : sans lui, un transcript restauré ne serait pas notable.
    expect(result['messages'][0].isComplete).toBe(true);
  });

  it('rejoue l’avis déjà donné sur une réponse', async () => {
    respondWith(200, {
      messages: [
        { id: 10, actor: 'assistant', message: 'Utile', is_satisfied: true },
        { id: 11, actor: 'assistant', message: 'Inutile', is_satisfied: false },
        { id: 12, actor: 'assistant', message: 'Sans avis', is_satisfied: null },
      ],
    });

    await restoreMessages('https://api.test', 'conv_1');

    expect(satisfactionStateService.getState('10')).toBe('up');
    expect(satisfactionStateService.getState('11')).toBe('down');
    expect(satisfactionStateService.getState('12')).toBeNull();
  });

  it('déclare la session perdue et la purge sur un 404', async () => {
    rememberSession('conv_absente');
    respondWith(404, {});

    const result = await restoreMessages('https://api.test', 'conv_absente');

    expect(result).toEqual({ status: 'gone' });
    // La session est jetée : le composant en ouvrira une neuve.
    expect(loadConversationId()).toBeNull();
  });

  it('garde la session quand l’API est injoignable', async () => {
    const attendu = rememberSession(resolveConversationId().id);
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down')) as unknown as typeof fetch;
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await restoreMessages('https://api.test', attendu);

    expect(result).toEqual({ status: 'unavailable' });
    // Une panne passagère ne doit pas détruire un transcript qui existe encore.
    expect(loadConversationId()).toBe(attendu);
  });

  it('accepte une conversation sans aucun message', async () => {
    respondWith(200, { messages: [] });

    expect(await restoreMessages('https://api.test', 'conv_vide')).toEqual({ status: 'restored', messages: [] });
  });
});
