import { newE2EPage } from '@stencil/core/testing';

describe('chat-widget', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<chat-widget></chat-widget>');

    const element = await page.find('chat-widget');
    expect(element).toHaveClass('hydrated');
  });
});
