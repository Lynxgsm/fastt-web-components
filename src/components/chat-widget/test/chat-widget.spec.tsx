import { newSpecPage } from '@stencil/core/testing';
import { ChatWidget } from '../chat-widget';

// chat-widget ne porte plus que son chrome : le parcours est testé sur
// chat-conversation.
describe('chat-widget', () => {
  it('rend le panneau, la bulle et délègue la conversation', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget api-endpoint="http://api.test"></chat-widget>`,
    });

    expect(page.root.shadowRoot.querySelector('.chat-widget-container')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.chat-toggler')).toBeTruthy();

    const conversation = page.root.shadowRoot.querySelector('chat-conversation');
    expect(conversation).toBeTruthy();
    // Enfant non hydraté dans un spec page : la valeur arrive en attribut.
    expect(conversation.outerHTML).toContain('http://api.test');
  });

  it('replie et déplie le panneau', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });

    const container = page.root.shadowRoot.querySelector('.chat-widget-container');
    expect(container.className).not.toContain('hide');

    (page.root.shadowRoot.querySelector('.chat-toggler') as HTMLButtonElement).click();
    await page.waitForChanges();
    expect(
      page.root.shadowRoot.querySelector('.chat-widget-container').className,
    ).toContain('hide');
  });
});
