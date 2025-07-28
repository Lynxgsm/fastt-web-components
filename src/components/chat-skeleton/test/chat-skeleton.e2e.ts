import { newE2EPage } from '@stencil/core/testing';

describe('chat-skeleton', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<chat-skeleton></chat-skeleton>');

    const element = await page.find('chat-skeleton');
    expect(element).toHaveClass('hydrated');
  });
});
