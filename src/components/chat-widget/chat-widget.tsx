import { Component, Env, h, Prop, State } from '@stencil/core';
import { callAIStream } from '../../utils/api-service';
import { generateConversationId } from '../../utils/utils';
import { marked } from 'marked';

@Component({
  tag: 'chat-widget',
  styleUrl: 'chat-widget.css',
  shadow: true,
})
export class ChatWidget {
  @State() messages: { role: string; content: string; isComplete?: boolean }[] = [];
  @State() isLoading: boolean = false;
  @State() isChatContainerVisible: boolean = true;
  @Prop() apiEndpoint: string = Env.API_URL;
  @State() conversationId: string = '';

  private inputEl?: HTMLInputElement;

  componentWillLoad() {
    // Initialize conversation ID when component first loads
    this.conversationId = generateConversationId();
    console.log('Generated conversation ID:', this.conversationId);
    this.loadFonts();

    // Configure marked for safe rendering
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true, // GitHub Flavored Markdown
    });
  }

  private loadFonts() {
    // Check if fonts are already loaded to avoid duplicates
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Signika"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Signika:wght@300..700&family=Yantramanav:wght@100;300;400;500;700;900&display=swap';
      document.head.appendChild(link);
    }
  }

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    const input = this.inputEl;
    if (!input || !input.value.trim()) return;
    const message = input.value;
    const userMessage = { role: 'user', content: message, isComplete: true };
    this.messages = [...this.messages, userMessage];
    input.value = '';
    this.isLoading = true;
    const aiMessageIndex = this.messages.length;
    this.messages = [...this.messages, { role: 'ai', content: '', isComplete: false }];
    try {
      await callAIStream(
        message,
        this.apiEndpoint,
        this.conversationId,
        (chunk: string) => {
          const newMessages = [...this.messages];
          newMessages[aiMessageIndex].content += chunk;
          this.messages = newMessages;
        },
        () => {
          this.isLoading = false;
          const newMessages = [...this.messages];
          newMessages[aiMessageIndex].isComplete = true;
          this.messages = newMessages;
        },
        () => {
          const newMessages = [...this.messages];
          newMessages[aiMessageIndex] = {
            ...newMessages[aiMessageIndex],
            content: 'Sorry, I encountered an error. Please try again.',
            isComplete: true,
          };
          this.messages = newMessages;
          this.isLoading = false;
        },
      );
    } catch (error) {
      const newMessages = [...this.messages];
      newMessages[aiMessageIndex] = {
        ...newMessages[aiMessageIndex],
        content: 'Sorry, I encountered an error. Please try again.',
        isComplete: true,
      };
      this.messages = newMessages;
      this.isLoading = false;
    }
  };

  private toggleChatContainer = () => {
    this.isChatContainerVisible = !this.isChatContainerVisible;
  };

  private setInputRef = (el: HTMLInputElement) => {
    this.inputEl = el;
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
        // Add target="_blank" to all links
        return result.replace(/<a\s+href=/gi, '<a target="_blank" rel="noopener noreferrer" href=');
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
    return [
      <div
        class={{
          'chat-widget-container': true,
          'hide': !this.isChatContainerVisible,
        }}
      >
        <div class="chat-header">
          <h3 class="chat-title">Que puis-je faire pour vous ?</h3>
          <button class="close-button" onClick={this.toggleChatContainer}>
            ×
          </button>
        </div>
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
                    <>
                      <div class="markdown-content" innerHTML={this.renderMarkdown(message.content)}></div>
                      {message.isComplete && <satisfaction-buttons api-endpoint={this.apiEndpoint} conversation-id={this.conversationId} />}
                    </>
                  )}
                </>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
          ))}
        </div>
        <form class="input-container" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Tapez un message..." name="message" required class="input" ref={this.setInputRef} />
          <button type="submit" disabled={this.isLoading} class="send-button">
            {this.isLoading ? (
              'Envoi...'
            ) : (
              <svg
                class="send-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </form>
      </div>,
      <button class="chat-toggler" onClick={this.toggleChatContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </button>,
    ];
  }
}
