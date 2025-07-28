import { newSpecPage } from '@stencil/core/testing';
import { ChatSkeleton } from '../chat-skeleton';

describe('chat-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChatSkeleton],
      html: `<chat-skeleton></chat-skeleton>`,
    });
    expect(page.root).toEqualHtml(`
      <chat-skeleton>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </chat-skeleton>
    `);
  });
});
