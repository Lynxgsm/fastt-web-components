import { Component, Env, Fragment, h, Prop, State } from '@stencil/core';
import { callAIStream, DecisionNode, ScopeEvent } from '../../utils/api-service';
import { generateConversationId, generateMessageId } from '../../utils/utils';
import { marked } from 'marked';

type ChatMessage = {
  role: string;
  content: string;
  isComplete?: boolean;
  messageId?: string;
  /** Renseigné quand le serveur a élargi la recherche hors du thème choisi. */
  outOfScopePath?: string[];
};

@Component({
  tag: 'chat-widget',
  styleUrl: 'chat-widget.css',
  shadow: true,
})
export class ChatWidget {
  @State() messages: ChatMessage[] = [];
  @State() isLoading: boolean = false;
  @State() isChatContainerVisible: boolean = true;
  @Prop() apiEndpoint: string = Env.API_URL;
  @State() conversationId: string = '';

  /** 'navigating' : arbre affiché, saisie bloquée. 'chatting' : saisie ouverte. */
  @State() mode: 'navigating' | 'chatting' = 'navigating';
  @State() contextNodeId: number | null = null;
  @State() contextPath: string[] = [];

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

  private handleLeafSelected = (e: CustomEvent<{ node: DecisionNode; path: DecisionNode[] }>) => {
    const { node, path } = e.detail;
    this.contextNodeId = node.id;
    this.contextPath = path.map(n => n.label);
    this.mode = 'chatting';
    if (node.intro_message) {
      this.messages = [
        ...this.messages,
        { role: 'ai', content: node.intro_message, isComplete: true, messageId: generateMessageId() },
      ];
    }
  };

  /** Échappatoire : interroger tout le corpus FASTT sans passer par l'arbre. */
  private handleSkip = () => {
    this.contextNodeId = null;
    this.contextPath = [];
    this.mode = 'chatting';
  };

  private changeTheme = () => {
    this.contextNodeId = null;
    this.contextPath = [];
    this.mode = 'navigating';
  };

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
        (messageId?: string) => {
          this.isLoading = false;
          const newMessages = [...this.messages];
          newMessages[aiMessageIndex].messageId = messageId;
          newMessages[aiMessageIndex].isComplete = true;
          this.messages = newMessages;
        },
        () => {
          const newMessages = [...this.messages];
          newMessages[aiMessageIndex] = {
            ...newMessages[aiMessageIndex],
            content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
            isComplete: true,
          };
          this.messages = newMessages;
          this.isLoading = false;
        },
        this.contextNodeId,
        (scope: ScopeEvent) => {
          if (scope.notice_key === 'out_of_scope') {
            this.messages = this.messages.map((msg, index) =>
              index === aiMessageIndex ? { ...msg, outOfScopePath: scope.path } : msg,
            );
          }
        },
      );
    } catch (error) {
      const newMessages = [...this.messages];
      newMessages[aiMessageIndex] = {
        ...newMessages[aiMessageIndex],
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
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
        {this.mode === 'chatting' && (
          <div class="context-banner">
            <span class="context-label">
              {this.contextPath.length > 0 ? this.contextPath.join(' › ') : 'Toutes les informations FASTT'}
            </span>
            <button type="button" class="context-change" onClick={this.changeTheme}>
              Changer de thème
            </button>
          </div>
        )}
        <div class="message-container">
          {this.mode === 'navigating' && (
            <decision-tree-nav
              apiEndpoint={this.apiEndpoint}
              onLeafSelected={this.handleLeafSelected}
              onSkipRequested={this.handleSkip}
            />
          )}
          {this.mode === 'chatting' && this.messages.map((message, index) => (
            <div
              key={index}
              class={{
                'message': true,
                'user-message': message.role === 'user',
                'ai-message': message.role === 'ai',
              }}
            >
              {message.role === 'ai' ? (
                <Fragment>
                  {message.outOfScopePath && message.outOfScopePath.length > 0 && (
                    <div class="scope-notice">
                      Cette question sort du thème « {message.outOfScopePath.join(' › ')} ». J'ai cherché dans l'ensemble des informations FASTT.
                    </div>
                  )}
                  {this.isLoading && message.content === '' ? (
                    <chat-skeleton />
                  ) : (
                    <Fragment>
                      <div class="markdown-content" innerHTML={this.renderMarkdown(message.content)}></div>
                      {message.isComplete && <satisfaction-buttons api-endpoint={this.apiEndpoint} message-id={message.messageId} />}
                    </Fragment>
                  )}
                </Fragment>
              ) : (
                <span>{message.content}</span>
              )}
            </div>
          ))}
        </div>
        <form class="input-container" onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder={this.mode === 'navigating' ? 'Choisissez d’abord un thème ci-dessus' : 'Tapez un message...'}
            name="message"
            required
            class="input"
            disabled={this.isLoading || this.mode === 'navigating'}
            ref={this.setInputRef}
          />
          <button type="submit" disabled={this.isLoading || this.mode === 'navigating'} class="send-button">
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
