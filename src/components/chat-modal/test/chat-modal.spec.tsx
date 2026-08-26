import { newSpecPage } from '@stencil/core/testing';
import { ChatModal } from '../chat-modal';

// chat-modal ne porte plus que son chrome : le parcours (arbre, réponses
// pré-enregistrées, vote, saisie) est testé sur chat-conversation.
describe('chat-modal', () => {
  it('rend son conteneur et son titre par défaut', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    expect(page.root.shadowRoot.querySelector('.chat-container')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.modal-title').textContent).toContain(
      'Que puis-je faire pour vous ?',
    );
  });

  it('respecte un titre personnalisé', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal modal-title="Besoin d'aide ?"></chat-modal>`,
    });

    expect(page.root.shadowRoot.querySelector('.modal-title').textContent).toContain(
      "Besoin d'aide ?",
    );
  });

  it('délègue la conversation et lui transmet apiEndpoint', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal api-endpoint="http://api.test"></chat-modal>`,
    });

    const conversation = page.root.shadowRoot.querySelector('chat-conversation');
    expect(conversation).toBeTruthy();
    // Enfant non hydraté dans un spec page : la valeur arrive en attribut.
    expect(conversation.outerHTML).toContain('http://api.test');
  });
});
