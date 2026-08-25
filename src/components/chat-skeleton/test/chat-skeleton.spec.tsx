import { newSpecPage } from '@stencil/core/testing';
import { ChatSkeleton } from '../chat-skeleton';

describe('chat-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChatSkeleton],
      html: `<chat-skeleton></chat-skeleton>`,
    });
    expect(page.root.shadowRoot.querySelector('.skeleton-container')).toBeTruthy();
    expect(page.root.shadowRoot.querySelectorAll('.skeleton-dot').length).toBeGreaterThan(0);
  });
});
