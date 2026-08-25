import { newSpecPage } from '@stencil/core/testing';
import { ChatWidget } from '../chat-widget';

beforeEach(() => {
  // L'arbre de décision est chargé au montage : neutraliser le réseau.
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ nodes: [] }),
  });
});

describe('chat-widget', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });
    expect(page.root.shadowRoot.querySelector('.chat-widget-container')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.chat-toggler')).toBeTruthy();
  });

  it("bloque la saisie tant qu'aucune feuille n'est atteinte", async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });
    expect(page.root.shadowRoot.querySelector('decision-tree-nav')).toBeTruthy();
    const input = page.root.shadowRoot.querySelector('input[name="message"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('ouvre la saisie et affiche le contexte une fois la feuille atteinte', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });
    (page.rootInstance as any).mode = 'chatting';
    (page.rootInstance as any).contextPath = ['Crédit', 'Prêt personnel'];
    await page.waitForChanges();

    const input = page.root.shadowRoot.querySelector('input[name="message"]') as HTMLInputElement;
    expect(input.disabled).toBe(false);
    expect(page.root.shadowRoot.querySelector('.context-label').textContent).toContain('Crédit › Prêt personnel');
  });
});
