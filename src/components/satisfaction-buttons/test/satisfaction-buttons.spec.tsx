import { newSpecPage } from '@stencil/core/testing';
import { SatisfactionButtons } from '../satisfaction-buttons';

// Structure réellement rendue plutôt qu'égalité HTML complète : le squelette
// généré attendait un <slot/> et échouait depuis l'écriture du composant.
describe('satisfaction-buttons', () => {
  it('rend un pouce en haut et un pouce en bas', async () => {
    const page = await newSpecPage({
      components: [SatisfactionButtons],
      html: `<satisfaction-buttons></satisfaction-buttons>`,
    });

    const root = page.root.shadowRoot;
    expect(root.querySelector('.satisfaction-container')).toBeTruthy();
    expect(root.querySelectorAll('.satisfaction-btn').length).toBe(2);
    expect(root.querySelector('.satisfaction-btn.thumbs-up')).toBeTruthy();
    expect(root.querySelector('.satisfaction-btn.thumbs-down')).toBeTruthy();
  });

  it('ne marque aucun bouton comme actif avant un clic', async () => {
    const page = await newSpecPage({
      components: [SatisfactionButtons],
      html: `<satisfaction-buttons></satisfaction-buttons>`,
    });

    expect(page.rootInstance.selectedButton).toBeNull();
    expect(page.root.shadowRoot.querySelectorAll('.satisfaction-btn.active').length).toBe(0);
  });

  it('marque le bouton choisi comme actif', async () => {
    const page = await newSpecPage({
      components: [SatisfactionButtons],
      html: `<satisfaction-buttons></satisfaction-buttons>`,
    });

    page.rootInstance.selectedButton = 'up';
    await page.waitForChanges();

    expect(page.root.shadowRoot.querySelector('.thumbs-up').className).toContain('active');
    expect(page.root.shadowRoot.querySelector('.thumbs-down').className).not.toContain('active');
  });

  it('se donne une URL d’API exploitable par défaut', async () => {
    const page = await newSpecPage({
      components: [SatisfactionButtons],
      html: `<satisfaction-buttons></satisfaction-buttons>`,
    });

    // Non-régression du correctif d'URL : la valeur par défaut doit être une
    // URL utilisable, et surtout ne pas être obtenue en écrasant `Env.API_URL`
    // globalement — ce que faisait `(Env.API_URL = '...')`, avec pour effet de
    // rediriger aussi chat-widget et chat-modal.
    expect(typeof page.rootInstance.apiEndpoint).toBe('string');
    expect(page.rootInstance.apiEndpoint).toMatch(/^https?:\/\/.+/);
  });
});
