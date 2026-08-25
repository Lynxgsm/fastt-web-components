import { newSpecPage } from '@stencil/core/testing';
import { ChatModal } from '../chat-modal';

// L'arbre est chargé au montage : on neutralise le réseau.
beforeEach(() => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ nodes: [] }),
  });
});

async function chattingPage() {
  const page = await newSpecPage({
    components: [ChatModal],
    html: `<chat-modal></chat-modal>`,
  });
  // Simule l'arrivée sur une feuille : c'est ce qui ouvre la saisie.
  (page.rootInstance as any).mode = 'chatting';
  await page.waitForChanges();
  return page;
}

describe('chat-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    expect(page.root.shadowRoot.querySelector('.chat-container')).toBeTruthy();

    const modalTitle = page.root.shadowRoot.querySelector('.modal-title');
    expect(modalTitle).toBeTruthy();
    expect(modalTitle.textContent).toContain('Que puis-je faire pour vous ?');
  });

  it("bloque la saisie tant qu'aucune feuille n'est atteinte", async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    expect(page.root.shadowRoot.querySelector('decision-tree-nav')).toBeTruthy();

    const input = page.root.shadowRoot.querySelector('input[name="message"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);

    const button = page.root.shadowRoot.querySelector('.send-button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('ouvre la saisie et affiche le contexte une fois la feuille atteinte', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    (page.rootInstance as any).mode = 'chatting';
    (page.rootInstance as any).contextPath = ['Logement', 'En déplacement'];
    await page.waitForChanges();

    const input = page.root.shadowRoot.querySelector('input[name="message"]') as HTMLInputElement;
    expect(input.disabled).toBe(false);
    expect(page.root.shadowRoot.querySelector('decision-tree-nav')).toBeNull();
    expect(page.root.shadowRoot.querySelector('.context-label').textContent).toContain('Logement › En déplacement');
  });

  it('signale la bascule hors périmètre', async () => {
    const page = await chattingPage();

    (page.rootInstance as any).messages = [
      { role: 'user', content: 'Quel montant puis-je emprunter ?' },
      { role: 'ai', content: 'Réponse', isComplete: true, outOfScopePath: ['Logement', 'En déplacement'] },
    ];
    await page.waitForChanges();

    const notice = page.root.shadowRoot.querySelector('.scope-notice');
    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain('sort du thème');
    expect(notice.textContent).toContain('Logement › En déplacement');
  });

  it('renders markdown content correctly', async () => {
    const page = await chattingPage();

    (page.rootInstance as any).messages = [
      { role: 'user', content: 'Hello' },
      { role: 'ai', content: '**Bold text** and *italic text*', isComplete: true, messageId: 'msg_1' },
    ];
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelectorAll('.message').length).toBe(2);

    const markdownContent = page.root.shadowRoot.querySelector('.markdown-content');
    expect(markdownContent).toBeTruthy();
    expect(markdownContent.innerHTML).toContain('<strong>Bold text</strong>');
    expect(markdownContent.innerHTML).toContain('<em>italic text</em>');
  });

  it('sanitizes dangerous HTML content', async () => {
    const page = await chattingPage();

    (page.rootInstance as any).messages = [
      { role: 'user', content: 'Hello' },
      { role: 'ai', content: '<script>alert("xss")</script>**Safe markdown**', isComplete: true, messageId: 'msg_1' },
    ];
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelectorAll('.message').length).toBe(2);

    const markdownContent = page.root.shadowRoot.querySelector('.markdown-content');
    expect(markdownContent).toBeTruthy();
    expect(markdownContent.innerHTML).not.toContain('<script>');
    expect(markdownContent.innerHTML).toContain('<strong>Safe markdown</strong>');
  });
});
