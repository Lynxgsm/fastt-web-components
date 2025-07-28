import { newE2EPage } from '@stencil/core/testing';

describe('satisfaction-buttons', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<satisfaction-buttons></satisfaction-buttons>');

    const element = await page.find('satisfaction-buttons');
    expect(element).toHaveClass('hydrated');
  });
});
