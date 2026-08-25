import { Component, Fragment, Host, h, State, Prop, Env } from '@stencil/core';
import { TitleStyle } from './types';
import { generateConversationId, generateMessageId } from '../../utils/utils';
import { callAIStream, DecisionNode, ScopeEvent } from '../../utils/api-service';
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
  tag: 'chat-modal',
  styleUrl: 'chat-modal.css',
  shadow: true,
})
export class ChatModal {
  @Prop() modalTitle: string = 'Que puis-je faire pour vous ?';
  @Prop() titleStyle: Partial<TitleStyle> = {};
  @State() messages: ChatMessage[] = [];
  @State() isLoading: boolean = false;
  @Prop() iconSize: number = 16;
  @Prop() apiEndpoint: string = Env.API_URL;
  @State() conversationId: string = '';

  /** 'navigating' : arbre affiché, saisie bloquée. 'chatting' : saisie ouverte. */
  @State() mode: 'navigating' | 'chatting' = 'navigating';
  @State() contextNodeId: number | null = null;
  @State() contextPath: string[] = [];

  componentWillLoad() {
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

  private handleChunk = async (message: string) => {
    try {
      const aiMessageIndex = this.messages.length - 1;

      await callAIStream(
        message,
        this.apiEndpoint,
        this.conversationId,
        (chunk: string) => {
          this.messages = this.messages.map((msg, index) => (index === aiMessageIndex ? { ...msg, content: msg.content + chunk } : msg));
        },
        (messageId?: string) => {
          this.messages = this.messages.map((msg, index) => 
            index === aiMessageIndex 
              ? { ...msg, isComplete: true, messageId: messageId || msg.messageId } 
              : msg
          );
          this.isLoading = false;
        },
        (error: Error) => {
          console.error('AI stream error:', error);
          this.messages = this.messages.map((msg, index) =>
            index === aiMessageIndex ? { ...msg, content: "Désolé, une erreur s'est produite. Veuillez réessayer.", isComplete: true } : msg,
          );
          this.isLoading = false;
        },
        this.contextNodeId,
        (scope: ScopeEvent) => {
          // Bandeau déterministe : le serveur sait avec certitude qu'il a élargi
          // la recherche, inutile de demander au modèle de l'annoncer.
          if (scope.notice_key === 'out_of_scope') {
            this.messages = this.messages.map((msg, index) =>
              index === aiMessageIndex ? { ...msg, outOfScopePath: scope.path } : msg,
            );
          }
        },
      );
    } catch (error) {
      console.error('Failed to call AI stream:', error);
      const aiMessageIndex = this.messages.length - 1;
      this.messages = this.messages.map((msg, index) =>
        index === aiMessageIndex ? { ...msg, content: "Désolé, une erreur s'est produite. Veuillez réessayer.", isComplete: true } : msg,
      );
      this.isLoading = false;
    }
  };

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input[name="message"]') as HTMLInputElement;
    const message = input.value.trim();
    if (!message) return;
    this.messages = [
      ...this.messages,
      { role: 'user', content: message, messageId: generateMessageId() },
      { role: 'ai', content: '', messageId: generateMessageId() },
    ];
    this.isLoading = true;
    form.reset();
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

  private renderContextBanner() {
    if (this.mode !== 'chatting') return null;
    const label = this.contextPath.length > 0 ? this.contextPath.join(' › ') : 'Toutes les informations FASTT';
    return (
      <div class="context-banner">
        <span class="context-label" title={label}>
          {label}
        </span>
        <button type="button" class="context-change" onClick={this.changeTheme}>
          Changer de thème
        </button>
      </div>
    );
  }

  render() {
    const navigating = this.mode === 'navigating';
    return (
      <Host>
        <div class="chat-container">
          <div class="modal-header">
            <span class="modal-title">{this.modalTitle}</span>
          </div>
          {this.renderContextBanner()}
          <div class="chat-content">
            <div class="message-container">
              {navigating && (
                <decision-tree-nav
                  apiEndpoint={this.apiEndpoint}
                  onLeafSelected={this.handleLeafSelected}
                  onSkipRequested={this.handleSkip}
                />
              )}
              {!navigating && this.messages.map((message, index) => (
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
                      {this.isLoading && message.content === '' ? <chat-skeleton /> : <div class="markdown-content" innerHTML={this.renderMarkdown(message.content)}></div>}
                      {message.isComplete && <satisfaction-buttons message-id={message.messageId} api-endpoint={this.apiEndpoint} />}
                    </Fragment>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              ))}
            </div>
            <form class="input-container" onSubmit={this.handleSubmit}>
              <input
                name="message"
                type="text"
                placeholder={navigating ? 'Choisissez d’abord un thème ci-dessus' : 'Tapez votre message ici...'}
                disabled={this.isLoading || navigating}
              />
              <button type="submit" disabled={this.isLoading || navigating} class="send-button">
                {this.isLoading ? (
                  'Envoi...'
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={this.iconSize}
                    height={this.iconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-send-horizontal-icon lucide-send-horizontal"
                  >
                    <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                    <path d="M6 12h16" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </Host>
    );
  }
}
