import { Component, Host, h, State, Prop, Env } from '@stencil/core';
import { TitleStyle } from './types';
import { generateConversationId } from '../../utils/utils';
import { callAIStream } from '../../utils/api-service';
import { marked } from 'marked';

@Component({
  tag: 'chat-modal',
  styleUrl: 'chat-modal.css',
  shadow: true,
})
export class ChatModal {
  @State() open = true;
  @Prop() modalTitle: string = "Que puis-je faire pour vous ?";
  @Prop() titleStyle: Partial<TitleStyle> = {};
  @State() messages: { role: string; content: string; isComplete?: boolean }[] = [];
  @State() isLoading: boolean = false;
  @Prop() iconSize: number = 16;
  @Prop() apiEndpoint: string = Env.API_URL;
  @State() conversationId: string = '';

  componentWillLoad() {
    this.conversationId = generateConversationId();
    console.log('Generated conversation ID:', this.conversationId);
    this.loadFonts();

    // Configure marked for safe rendering
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true,    // GitHub Flavored Markdown
    });
  }

  private loadFonts() {
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Signika"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Signika:wght@300..700&family=Yantramanav:wght@100;300;400;500;700;900&display=swap';
      document.head.appendChild(link);
    }
  }

  private closeModal = () => {
    this.open = false;
  };

  private handleChunk = async (message: string) => {
    try {
      const aiMessageIndex = this.messages.length - 1;

      await callAIStream(
        message,
        this.apiEndpoint,
        this.conversationId,
        (chunk: string) => {
          this.messages = this.messages.map((msg, index) =>
            index === aiMessageIndex
              ? { ...msg, content: msg.content + chunk }
              : msg
          );
        },
        () => {
          this.messages = this.messages.map((msg, index) =>
            index === aiMessageIndex
              ? { ...msg, isComplete: true }
              : msg
          );
          this.isLoading = false;
        },
        (error: Error) => {
          console.error('AI stream error:', error);
          this.messages = this.messages.map((msg, index) =>
            index === aiMessageIndex
              ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true }
              : msg
          );
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error('Failed to call AI stream:', error);
      const aiMessageIndex = this.messages.length - 1;
      this.messages = this.messages.map((msg, index) =>
        index === aiMessageIndex
          ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true }
          : msg
      );
      this.isLoading = false;
    }
  };

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input[name="message"]') as HTMLInputElement;
    const message = input.value;
    this.messages.push({ role: 'user', content: message });
    this.isLoading = true;
    form.reset();
    this.messages.push({ role: 'ai', content: '' });
    await this.handleChunk(message);
  };

  private renderMarkdown(content: string): string {
    try {
      // Sanitize the content to prevent XSS attacks
      const sanitizedContent = content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');

      // Handle both synchronous and asynchronous marked versions
      const result = marked(sanitizedContent);
      if (typeof result === 'string') {
        return result;
      } else {
        // If it's a Promise, return a placeholder and handle it asynchronously
        return sanitizedContent;
      }
    } catch (error) {
      console.error('Error parsing markdown:', error);
      // Fallback to plain text if markdown parsing fails
      return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }

  render() {
    return (
      <Host>
        <div class={{ 'modal-overlay': true, visible: this.open }}>
          <div class="chat-container">
            <div class="modal-header">
              <span class="modal-title">{this.modalTitle}</span>
              <button class="close-button" onClick={this.closeModal} aria-label="Close">&times;</button>
            </div>
            <div class="chat-content">
              <div class="message-container">
                {this.messages.map((message, index) => (
                  <div
                    key={index}
                    class={{
                      'message': true,
                      'user-message': message.role === 'user',
                      'ai-message': message.role === 'ai',
                    }}
                  >
                    {message.role === 'ai' ? (
                      <>
                        {this.isLoading && message.content === '' ? (
                          <chat-skeleton />
                        ) : (
                          <div class="markdown-content" innerHTML={this.renderMarkdown(message.content)}></div>
                        )}
                        {message.isComplete && <satisfaction-buttons />}
                      </>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                ))}
              </div>
              <form class="input-container" onSubmit={this.handleSubmit}>
                <input
                  name='message'
                  type='text'
                  placeholder='Tapez votre message ici...'
                  disabled={this.isLoading}
                />
                <button
                  type='submit'
                  disabled={this.isLoading}
                  class="send-button"
                >
                  {this.isLoading ? 'Envoi...' : <svg xmlns="http://www.w3.org/2000/svg" width={this.iconSize} height={this.iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" /><path d="M6 12h16" /></svg>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
