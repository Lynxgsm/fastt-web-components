import { newSpecPage } from '@stencil/core/testing';
import { ChatWidget } from '../chat-widget';

// Structure réellement rendue plutôt qu'égalité HTML complète : le squelette
// généré attendait un <slot/> et échouait depuis l'écriture du composant. Une
// égalité sur 25 lignes de balisage casserait au premier ajustement de style.
describe('chat-widget', () => {
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
});
