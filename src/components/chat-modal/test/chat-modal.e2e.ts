import { newE2EPage } from '@stencil/core/testing';

describe('chat-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<chat-modal></chat-modal>');

    const element = await page.find('chat-modal');
    expect(element).toHaveClass('hydrated');
  });
});
