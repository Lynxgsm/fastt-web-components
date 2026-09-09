import { newSpecPage } from '@stencil/core/testing';
import { ChatWidget } from '../chat-widget';

// `newSpecPage` monte le composant dans une fenêtre simulée neuve : un
// `localStorage` amorcé avant l'appel serait perdu, et le transpileur de Stencil
// ne remonte pas `jest.mock` au-dessus des imports. Les tests de reprise pilotent
// donc directement le cycle de vie du composant. Le stockage lui-même est couvert
// par `session-store.spec.ts`, et la projection des messages par
// `chat-session.spec.ts`.
const repondAvec = (status: number, body: unknown) => {
  global.fetch = jest.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    statusText: '',
    json: async () => body,
  }) as unknown as typeof fetch;
};

/** Rejoue ce que fait un rechargement de page sur une session existante. */
const simuleReprise = async (page: any, conversationId: string) => {
  page.rootInstance.conversationId = conversationId;
  page.rootInstance.isRestoring = true;
  await page.rootInstance.componentDidLoad();
  await page.waitForChanges();
};

// Structure réellement rendue plutôt qu'égalité HTML complète : le squelette
// généré attendait un <slot/> et échouait depuis l'écriture du composant. Une
// égalité sur 25 lignes de balisage casserait au premier ajustement de style.
describe('chat-widget', () => {
  // Le composant persiste sa session dès le montage : sans ce nettoyage, un test
  // reprendrait la conversation ouverte par le précédent.
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('rend l’en-tête, la zone de saisie et le bouton d’ouverture', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    const root = page.root.shadowRoot;
    expect(root.querySelector('.chat-header')).toBeTruthy();
    expect(root.querySelector('.chat-title').textContent).toContain('Que puis-je faire pour vous ?');
    expect(root.querySelector('form.input-container')).toBeTruthy();
    expect(root.querySelector('input.input')).toBeTruthy();
    expect(root.querySelector('button.send-button')).toBeTruthy();
    expect(root.querySelector('.chat-toggler')).toBeTruthy();
  });

  it('démarre sans message et sans chargement en cours', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    expect(page.rootInstance.messages).toEqual([]);
    expect(page.rootInstance.isLoading).toBe(false);
    expect(page.root.shadowRoot.querySelectorAll('.message').length).toBe(0);
  });

  it('rend un message utilisateur et une réponse en markdown', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    // `messages` est un @State : il faut passer par l'instance du composant.
    // L'affecter sur l'élément hôte, comme le faisait l'ancien test, ne
    // déclenche aucun rendu — d'où les 0 message trouvés.
    page.rootInstance.messages = [
      { role: 'user', content: 'Bonjour' },
      { role: 'ai', content: '**Gras** et *italique*', isComplete: true },
    ];
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelectorAll('.message').length).toBe(2);
    const markdown = page.root.shadowRoot.querySelector('.markdown-content');
    expect(markdown).toBeTruthy();
    expect(markdown.innerHTML).toContain('<strong>Gras</strong>');
    expect(markdown.innerHTML).toContain('<em>italique</em>');
  });

  it('se donne une URL d’API exploitable par défaut', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    expect(page.rootInstance.apiEndpoint).toMatch(/^https?:\/\/.+/);
  });

  it('reprend le transcript de la conversation rechargée', async () => {
    repondAvec(200, {
      messages: [
        { id: 1, actor: 'user', message: 'Bonjour', is_satisfied: null },
        { id: 2, actor: 'assistant', message: 'Bonjour, comment aider ?', is_satisfied: null },
      ],
    });
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    await simuleReprise(page, 'conv_repris');

    // L'identifiant est repris tel quel : c'est lui qui rattache la suite de
    // l'échange à ce qui est déjà en base.
    expect(page.rootInstance.conversationId).toBe('conv_repris');
    expect(page.rootInstance.messages.map(m => m.content)).toEqual(['Bonjour', 'Bonjour, comment aider ?']);
    expect(page.root.shadowRoot.querySelectorAll('.message').length).toBe(2);
    expect(page.rootInstance.isRestoring).toBe(false);
  });

  it('conserve l’identifiant courant quand l’API ne connaît pas la conversation', async () => {
    repondAvec(404, {});
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    await simuleReprise(page, 'conv_disparue');

    // Non-régression : fabriquer ici un identifiant neuf réécrivait le stockage et
    // effaçait la conversation vivante de l'autre composant de la page. Il n'y a rien
    // à afficher, mais rien à abandonner non plus.
    expect(page.rootInstance.conversationId).toBe('conv_disparue');
    expect(page.rootInstance.messages).toEqual([]);
    expect(page.rootInstance.isRestoring).toBe(false);
  });

  it('garde la session quand l’API est injoignable, sans transcript', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network down')) as unknown as typeof fetch;
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    await simuleReprise(page, 'conv_intacte');

    // Une panne passagère ne doit pas détruire une conversation qui existe encore.
    expect(page.rootInstance.conversationId).toBe('conv_intacte');
    expect(page.rootInstance.messages).toEqual([]);
  });

  it('n’appelle pas l’API quand il n’y a aucune session à reprendre', async () => {
    global.fetch = jest.fn() as unknown as typeof fetch;

    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });
    await page.waitForChanges();

    // Premier montage dans une fenêtre neuve : aucune session stockée, donc aucune
    // relecture — une première visite ne doit pas coûter une requête de plus.
    expect(page.rootInstance.isRestoring).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();

    // Et un second montage sans message envoyé non plus : c'est ce 404-là qui a
    // déclenché la perte de conversation en recette.
    const seconde = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });
    await seconde.waitForChanges();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(page.rootInstance.messages).toEqual([]);
  });

  it('vide l’affichage et détache la session sur « Nouvelle conversation »', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });
    const ancienId = page.rootInstance.conversationId;

    page.rootInstance.messages = [{ role: 'user', content: 'Bonjour', isComplete: true }];
    await page.waitForChanges();

    const bouton = page.root.shadowRoot.querySelector('.new-conversation-button') as HTMLButtonElement;
    expect(bouton).toBeTruthy();
    bouton.click();
    await page.waitForChanges();

    expect(page.rootInstance.messages).toEqual([]);
    expect(page.rootInstance.conversationId).not.toBe(ancienId);
    // Le bouton disparaît avec le transcript qu'il servait à effacer.
    expect(page.root.shadowRoot.querySelector('.new-conversation-button')).toBeFalsy();
  });
});
