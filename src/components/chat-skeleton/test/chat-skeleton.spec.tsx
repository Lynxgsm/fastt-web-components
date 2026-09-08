import { newSpecPage } from '@stencil/core/testing';
import { ChatSkeleton } from '../chat-skeleton';

// Ces tests visent la structure réellement rendue, et non une égalité HTML
// complète : le squelette généré par `stencil generate` attendait un simple
// <slot/> et échouait depuis que le composant a été écrit.
describe('chat-skeleton', () => {
  it('rend le conteneur du squelette', async () => {
    const page = await newSpecPage({
      components: [ChatSkeleton],
      html: `<chat-skeleton></chat-skeleton>`,
    });

    expect(page.root.shadowRoot.querySelector('.skeleton-container')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.skeleton-typing')).toBeTruthy();
  });

  it('rend les points de l’animation de saisie', async () => {
    const page = await newSpecPage({
      components: [ChatSkeleton],
      html: `<chat-skeleton></chat-skeleton>`,
    });

    // L'animation « en train d'écrire » repose sur ces points : sans eux le
    // composant s'affiche mais ne signale plus rien à l'utilisateur.
    expect(page.root.shadowRoot.querySelectorAll('.skeleton-dot').length).toBe(2);
  });
});
