import { newSpecPage } from '@stencil/core/testing';
import { ChatModal } from '../chat-modal';

describe('chat-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    // Check that the component renders with the modal structure
    const modalOverlay = page.root.shadowRoot.querySelector('.modal-overlay');
    expect(modalOverlay).toBeTruthy();

    const modalTitle = page.root.shadowRoot.querySelector('.modal-title');
    expect(modalTitle).toBeTruthy();
    expect(modalTitle.textContent).toContain('Que puis-je faire pour vous ?');
  });

  it('renders markdown content correctly', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    const chatModal = page.root;

    // Simulate adding messages by calling the component's methods
    chatModal.messages = [
      { role: 'user', content: 'Hello' },
      { role: 'ai', content: '**Bold text** and *italic text*', isComplete: true }
    ];

    // Force a re-render by calling the component's render method
    await page.waitForChanges();

    // Check if messages are rendered
    const messages = chatModal.shadowRoot.querySelectorAll('.message');
    expect(messages.length).toBe(2);

    // Check if markdown is rendered as HTML
    const markdownContent = chatModal.shadowRoot.querySelector('.markdown-content');
    expect(markdownContent).toBeTruthy();
    expect(markdownContent.innerHTML).toContain('<strong>Bold text</strong>');
    expect(markdownContent.innerHTML).toContain('<em>italic text</em>');
  });

  it('sanitizes dangerous HTML content', async () => {
    const page = await newSpecPage({
      components: [ChatModal],
      html: `<chat-modal></chat-modal>`,
    });

    const chatModal = page.root;

    // Set message with potentially dangerous content
    chatModal.messages = [
      { role: 'user', content: 'Hello' },
      { role: 'ai', content: '<script>alert("xss")</script>**Safe markdown**', isComplete: true }
    ];

    // Force a re-render
    await page.waitForChanges();

    // Check if messages are rendered
    const messages = chatModal.shadowRoot.querySelectorAll('.message');
    expect(messages.length).toBe(2);

    // Check if dangerous content is sanitized
    const markdownContent = chatModal.shadowRoot.querySelector('.markdown-content');
    expect(markdownContent).toBeTruthy();
    expect(markdownContent.innerHTML).not.toContain('<script>');
    expect(markdownContent.innerHTML).toContain('<strong>Safe markdown</strong>');
  });
});
