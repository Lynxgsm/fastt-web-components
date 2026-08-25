import { newSpecPage } from '@stencil/core/testing';
import { SatisfactionButtons } from '../satisfaction-buttons';

describe('satisfaction-buttons', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SatisfactionButtons],
      html: `<satisfaction-buttons message-id="msg_1"></satisfaction-buttons>`,
    });
    expect(page.root.shadowRoot.querySelector('.satisfaction-container')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.thumbs-up')).toBeTruthy();
    expect(page.root.shadowRoot.querySelector('.thumbs-down')).toBeTruthy();
  });
});
