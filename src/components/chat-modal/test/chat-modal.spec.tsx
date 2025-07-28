import { newSpecPage } from '@stencil/core/testing';
import { ChatModal } from '../chat-modal';

describe('chat-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <chat-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </chat-modal>
    `);
  });
});
