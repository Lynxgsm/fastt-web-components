import { newSpecPage } from '@stencil/core/testing';
import { ChatModal } from '../chat-modal';

describe('chat-modal', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('rend le conteneur et le titre', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    // `.modal-overlay` n'existe plus : la surcouche et les ombres ont été
    // retirées volontairement (commit d933de3). Le conteneur réel est
    // `.chat-container`.
    expect(page.root.shadowRoot.querySelector('.chat-container')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.modal-header')).toBeTruthy();

    const modalTitle = page.root.shadowRoot.querySelector('.modal-title');
    expect(modalTitle).toBeTruthy();
    expect(modalTitle.textContent).toContain('Que puis-je faire pour vous ?');
  });

  it('reprend le titre passé en attribut', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal modal-title="Support Client"></chat-modal>`,
    });

    expect(page.root.shadowRoot.querySelector('.modal-title').textContent).toContain('Support Client');
  });

  it('rend le markdown des réponses', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
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

    const markdownContent = page.root.shadowRoot.querySelector('.markdown-content');
    expect(markdownContent).toBeTruthy();
    expect(markdownContent.innerHTML).toContain('<strong>Gras</strong>');
    expect(markdownContent.innerHTML).toContain('<em>italique</em>');
  });

  it('distingue le message utilisateur de la réponse', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    page.rootInstance.messages = [
      { role: 'user', content: 'Bonjour' },
      { role: 'ai', content: 'Réponse', isComplete: true },
    ];
    await page.waitForChanges();

    const root = page.root.shadowRoot;
    expect(root.querySelectorAll('.message.user-message').length).toBe(1);
    expect(root.querySelectorAll('.message.ai-message').length).toBe(1);
    // Le message utilisateur n'est pas interprété comme du markdown.
    expect(root.querySelector('.user-message p').textContent).toBe('Bonjour');
  });

  it('neutralise le HTML dangereux d’une réponse', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    page.rootInstance.messages = [
      { role: 'user', content: 'Bonjour' },
      { role: 'ai', content: '<script>alert("xss")</script>**Markdown sûr**', isComplete: true },
    ];
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelectorAll('.message').length).toBe(2);

    const markdownContent = page.root.shadowRoot.querySelector('.markdown-content');
    expect(markdownContent).toBeTruthy();
    expect(markdownContent.innerHTML).not.toContain('<script>');
    expect(markdownContent.innerHTML).toContain('<strong>Markdown sûr</strong>');
  });

  it('neutralise aussi les iframes et les gestionnaires d’événements', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    // Les trois autres filtres de `renderMarkdown` n'étaient pas couverts.
    page.rootInstance.messages = [
      { role: 'ai', content: '<iframe src="http://x"></iframe><a href="javascript:alert(1)">a</a><b onclick="x()">b</b>', isComplete: true },
    ];
    await page.waitForChanges();

    const html = page.root.shadowRoot.querySelector('.markdown-content').innerHTML;
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('onclick=');
  });
});
