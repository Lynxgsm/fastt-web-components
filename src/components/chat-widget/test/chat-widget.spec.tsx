import { newSpecPage } from '@stencil/core/testing';
import { ChatWidget } from '../chat-widget';

describe('chat-widget', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChatWidget],
      html: `<chat-widget></chat-widget>`,
    });
    expect(page.root).toEqualHtml(`
      <chat-widget>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </chat-widget>
    `);
  });
});
