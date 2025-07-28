import { newSpecPage } from '@stencil/core/testing';
import { SatisfactionButtons } from '../satisfaction-buttons';

describe('satisfaction-buttons', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SatisfactionButtons],
      html: `<satisfaction-buttons></satisfaction-buttons>`,
    });
    expect(page.root).toEqualHtml(`
      <satisfaction-buttons>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </satisfaction-buttons>
    `);
  });
});
