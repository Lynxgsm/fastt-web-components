import { Component, Fragment, Host, h, State, Prop, Env } from '@stencil/core';
import { TitleStyle } from './types';
import { generateMessageId } from '../../utils/utils';
import { callAIStream, DEFAULT_API_ENDPOINT } from '../../utils/api-service';
import { resolveConversationId, restoreMessages, startNewConversation } from '../../utils/chat-session';
import { rememberSession } from '../../utils/session-store';
import { marked } from 'marked';

@Component({
  tag: 'chat-modal',
  styleUrl: 'chat-modal.css',
  shadow: true,
})
export class ChatModal {
  @Prop() modalTitle: string = 'Que puis-je faire pour vous ?';
  @Prop() titleStyle: Partial<TitleStyle> = {};
  @State() messages: { role: string; content: string; isComplete?: boolean; messageId?: string }[] = [];
  @State() isLoading: boolean = false;
  @Prop() iconSize: number = 16;
  @Prop() apiEndpoint: string = Env.API_URL || DEFAULT_API_ENDPOINT;
  @State() conversationId: string = '';
  @State() isRestoring: boolean = false;

  componentWillLoad() {
    // Reprendre la conversation précédente si elle n'est pas périmée, sinon en ouvrir
    // une neuve. Résolution synchrone : rien ici ne doit retarder le premier rendu.
    const { id, restored } = resolveConversationId();
    this.conversationId = id;
    this.isRestoring = restored;
    this.loadFonts();

    // Configure marked for safe rendering
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true, // GitHub Flavored Markdown
    });
  }

  // La relecture du transcript se fait ici, et non dans `componentWillLoad` : ce
  // dernier bloque le premier rendu s'il renvoie une promesse, et le modal resterait
  // vide le temps de la requête.
  async componentDidLoad() {
    if (!this.isRestoring) return;

    const result = await restoreMessages(this.apiEndpoint, this.conversationId);
    if (result.status === 'restored') {
      // L'utilisateur peut avoir envoyé un message avant la fin de la relecture :
      // l'historique se place devant, plutôt que d'écraser son échange en cours.
      this.messages = [...result.messages, ...this.messages];
    } else if (result.status === 'gone') {
      // L'identifiant stocké ne désigne rien en base : il n'y a rien à afficher, et
      // rien à abandonner non plus. On garde celui de cette page — en fabriquer un
      // neuf ici réécrivait le stockage et effaçait la conversation d'un autre
      // composant. `restoreMessages` a déjà purgé l'entrée devenue inutile.
      this.messages = [];
    }
    this.isRestoring = false;
  }

  // Vide l'affichage et détache la session stockée. Les messages restent en base pour
  // le back-office : c'est la vue de l'utilisateur qui repart de zéro, pas l'historique.
  private handleNewConversation = () => {
    this.conversationId = startNewConversation();
    this.messages = [];
    this.isLoading = false;
    this.isRestoring = false;
  };


  private loadFonts() {
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Signika"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Signika:wght@300..700&family=Yantramanav:wght@100;300;400;500;700;900&display=swap';
      document.head.appendChild(link);
    }
  }

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
            index === aiMessageIndex ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true } : msg,
          );
          this.isLoading = false;
        },
      );
    } catch (error) {
      console.error('Failed to call AI stream:', error);
      const aiMessageIndex = this.messages.length - 1;
      this.messages = this.messages.map((msg, index) =>
        index === aiMessageIndex ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isComplete: true } : msg,
      );
      this.isLoading = false;
    }
  };

  private handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input[name="message"]') as HTMLInputElement;
    const message = input.value;
    // C'est l'envoi qui persiste la session, pas le montage : avant le premier
    // message, la conversation n'existe pas encore en base. `rememberSession` renvoie
    // l'identifiant retenu — celui d'une session déjà ouverte, le cas échéant.
    this.conversationId = rememberSession(this.conversationId);
    this.messages.push({ role: 'user', content: message, messageId: generateMessageId() });
    this.isLoading = true;
    form.reset();
    this.messages.push({ role: 'ai', content: '', messageId: generateMessageId() });
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

  render() {
    return (
      <Host>
        <div class="chat-container">
          <div class="modal-header">
            <span class="modal-title">{this.modalTitle}</span>
            {this.messages.length > 0 && (
              <button class="new-conversation-button" onClick={this.handleNewConversation} title="Nouvelle conversation" aria-label="Nouvelle conversation">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </button>
            )}
          </div>
          <div class="chat-content">
            <div class="message-container">
              {this.isRestoring && <chat-skeleton />}
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
                    <Fragment>
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
              <input name="message" type="text" placeholder="Tapez votre message ici..." disabled={this.isLoading} />
              <button type="submit" disabled={this.isLoading} class="send-button">
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
