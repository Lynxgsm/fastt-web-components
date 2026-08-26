import { Component, Env, Fragment, h, Host, Prop, State } from '@stencil/core';
import { marked } from 'marked';
import {
  callAIStream,
  DecisionNode,
  fetchDecisionTree,
  fetchPresetAnswer,
  handleMessageFeedback,
  ScopeEvent,
} from '../../utils/api-service';
import { generateConversationId } from '../../utils/utils';

/**
 * Un tour de conversation. `id` est local et sert de clé de rendu ; `messageId`
 * est l'identifiant serveur, seul utilisable pour voter.
 */
type Turn = {
  id: number;
  role: 'user' | 'bot';
  content: string;
  messageId?: number | null;
  /** Renseigné quand le serveur a élargi la recherche hors du thème choisi. */
  outOfScopePath?: string[];
  streaming?: boolean;
};

/**
 * `choosing` : boutons d'options, saisie bloquée.
 * `rating`   : « Cela vous a-t-il aidé ? », saisie bloquée.
 * `typing`   : saisie ouverte — après un « Non », ou sur un thème sans question.
 * `streaming`: réponse du modèle en cours.
 */
type Step = 'choosing' | 'rating' | 'typing' | 'streaming';

const GREETING = 'Bonjour, je suis l’assistant FASTT. Sur quoi porte votre demande ?';

@Component({
  tag: 'chat-conversation',
  styleUrl: 'chat-conversation.css',
  shadow: true,
})
export class ChatConversation {
  @Prop() apiEndpoint: string = Env.API_URL;

  @State() turns: Turn[] = [];
  @State() nodes: DecisionNode[] = [];
  @State() path: DecisionNode[] = [];
  @State() step: Step = 'choosing';
  @State() treeError = '';

  private conversationId = '';
  private nextId = 1;
  /** Nœud courant : périmètre documentaire de la saisie libre. Une question
   *  résout les documents de son thème, un thème les siens. */
  private scopeNodeId: number | null = null;
  /** Message serveur soumis au vote en cours. */
  private ratingMessageId: number | null = null;
  private scroller?: HTMLDivElement;
  private inputEl?: HTMLInputElement;
  private pinnedToBottom = true;

  async componentWillLoad() {
    this.conversationId = generateConversationId();
    marked.setOptions({ breaks: true, gfm: true });
    this.say('bot', GREETING);
    try {
      this.nodes = await fetchDecisionTree(this.apiEndpoint);
      if (this.nodes.length === 0) {
        // Aucun arbre configuré : ne pas enfermer l'utilisateur dans une impasse.
        this.step = 'typing';
      }
    } catch (e) {
      console.error('chat-conversation:', e);
      this.treeError = "Les thèmes n'ont pas pu être chargés.";
      this.step = 'typing';
    }
  }

  componentDidRender() {
    // Les options sont épinglées sous un historique qui grandit : sans cela le
    // nouveau contenu apparaît hors écran.
    if (this.scroller && this.pinnedToBottom) {
      this.scroller.scrollTop = this.scroller.scrollHeight;
    }
  }

  private onScroll = () => {
    const el = this.scroller;
    if (!el) return;
    this.pinnedToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  };

  private say(role: 'user' | 'bot', content: string, extra: Partial<Turn> = {}): number {
    const id = this.nextId++;
    this.turns = [...this.turns, { id, role, content, ...extra }];
    return id;
  }

  /** Mise à jour par identifiant, jamais par position : un tour peut s'ajouter
   *  pendant qu'une réponse est en train d'arriver. */
  private patch(id: number, patch: Partial<Turn>) {
    this.turns = this.turns.map(t => (t.id === id ? { ...t, ...patch } : t));
  }

  private get options(): DecisionNode[] {
    const current = this.path[this.path.length - 1];
    return current ? current.children : this.nodes;
  }

  private pick = async (node: DecisionNode) => {
    this.say('user', node.label);
    this.path = [...this.path, node];
    this.scopeNodeId = node.id;

    if (node.kind === 'question') {
      await this.serveAnswer(node);
      return;
    }

    // Le message d'accueil du thème, quand l'administrateur en a saisi un.
    const intro = (node.intro_message || '').trim();
    if (intro) this.say('bot', intro);

    if (node.children.length > 0) {
      this.step = 'choosing';
      return;
    }

    // Thème sans question : on répond par la recherche, sur ses documents. Ne
    // jamais évoquer une réponse « pas encore enregistrée » — l'état du contenu
    // est l'affaire de l'administrateur, pas celle de l'utilisateur.
    if (!intro) {
      this.say('bot', `Posez votre question sur « ${node.label} ».`);
    }
    this.step = 'typing';
  };

  private async serveAnswer(node: DecisionNode) {
    try {
      const preset = await fetchPresetAnswer(this.apiEndpoint, node.id, this.conversationId);
      if (preset === null) {
        // Défensif : l'API élague les questions sans réponse, ce cas ne devrait
        // pas se produire. Le cas échéant, on répond par la recherche.
        this.say('bot', 'Reformulez votre question et je cherche dans la documentation FASTT.');
        this.step = 'typing';
        return;
      }
      this.say('bot', preset.answer, { messageId: preset.message_id });
      this.ratingMessageId = preset.message_id;
      this.step = 'rating';
    } catch (e) {
      console.error('chat-conversation:', e);
      this.say('bot', "Je n'ai pas pu récupérer la réponse. Posez votre question, je cherche dans la documentation.");
      this.step = 'typing';
    }
  }

  private rate = (helped: boolean) => {
    if (this.ratingMessageId !== null) {
      handleMessageFeedback(helped ? 1 : 0, this.apiEndpoint, String(this.ratingMessageId));
    }
    this.ratingMessageId = null;
    this.say('user', helped ? 'Oui' : 'Non');

    if (helped) {
      this.say('bot', 'Ravi d’avoir pu vous aider. Sur quel autre sujet puis-je répondre ?');
      this.path = [];
      this.scopeNodeId = null;
      this.step = 'choosing';
      return;
    }

    this.say('bot', "Navré de ne pas avoir pu vous aider. Posez votre question avec vos mots : je cherche dans l’ensemble de la documentation FASTT.");
    this.step = 'typing';
  };

  private back = () => {
    this.path = this.path.slice(0, -1);
    this.scopeNodeId = null;
    this.step = 'choosing';
  };

  private restart = () => {
    this.path = [];
    this.scopeNodeId = null;
    this.ratingMessageId = null;
    this.step = 'choosing';
  };

  private submit = async (e: Event) => {
    e.preventDefault();
    const value = this.inputEl?.value.trim();
    if (!value || this.step === 'streaming') return;

    this.say('user', value);
    const botId = this.say('bot', '', { streaming: true });
    if (this.inputEl) this.inputEl.value = '';
    this.step = 'streaming';

    await callAIStream(
      value,
      this.apiEndpoint,
      this.conversationId,
      (chunk: string) => {
        const turn = this.turns.find(t => t.id === botId);
        this.patch(botId, { content: (turn?.content ?? '') + chunk });
      },
      (messageId?: string) => {
        const id = messageId ? Number(messageId) : null;
        this.patch(botId, { streaming: false, messageId: id });
        this.ratingMessageId = id;
        this.step = 'rating';
      },
      (error: Error) => {
        console.error('chat-conversation:', error);
        this.patch(botId, {
          content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          streaming: false,
        });
        this.step = 'typing';
      },
      this.scopeNodeId,
      (scope: ScopeEvent) => {
        // Mention déterministe : le serveur sait avec certitude qu'il a élargi
        // la recherche. Demander au modèle de l'annoncer serait irrégulier.
        if (scope.notice_key === 'out_of_scope') {
          this.patch(botId, { outOfScopePath: scope.path });
        }
      },
    );
  };

  private renderMarkdown(content: string): string {
    try {
      const safe = content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
      const html = marked(safe);
      return typeof html === 'string'
        ? html.replace(/<a\s+href=/gi, '<a target="_blank" rel="noopener noreferrer" href=')
        : safe;
    } catch (e) {
      console.error('markdown:', e);
      return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }

  private renderAffordance() {
    if (this.step === 'rating') {
      return (
        <div class="rating">
          <p class="rating-question">Cela vous a-t-il aidé ?</p>
          <div class="rating-buttons">
            <button type="button" class="pill" onClick={() => this.rate(true)}>Oui</button>
            <button type="button" class="pill" onClick={() => this.rate(false)}>Non</button>
          </div>
        </div>
      );
    }

    if (this.step !== 'choosing') return null;

    if (this.treeError) {
      return <p class="notice">{this.treeError}</p>;
    }

    const options = this.options;
    if (options.length === 0) {
      return (
        <p class="notice">
          <button type="button" class="link" onClick={this.back}>← Retour</button>
        </p>
      );
    }

    return (
      <div class="options">
        {options.map(node => (
          <button key={node.id} type="button" class="option" onClick={() => this.pick(node)}>
            <span class="option-label">{node.label}</span>
            {node.description && <span class="option-description">{node.description}</span>}
          </button>
        ))}
        {this.path.length > 0 && (
          <button type="button" class="link" onClick={this.back}>← Retour</button>
        )}
      </div>
    );
  }

  render() {
    const typing = this.step === 'typing';
    return (
      <Host>
        <div class="transcript" ref={el => (this.scroller = el)} onScroll={this.onScroll}>
          {this.turns.map(turn => (
            <div key={turn.id} class={{ turn: true, 'turn-user': turn.role === 'user', 'turn-bot': turn.role === 'bot' }}>
              {turn.role === 'bot' ? (
                <Fragment>
                  {turn.outOfScopePath?.length > 0 && (
                    <div class="scope-notice">
                      Cette question sort du thème « {turn.outOfScopePath.join(' › ')} ». J’ai
                      cherché dans l’ensemble des informations FASTT.
                    </div>
                  )}
                  {turn.streaming && turn.content === '' ? (
                    <chat-skeleton />
                  ) : (
                    <div class="markdown" innerHTML={this.renderMarkdown(turn.content)} />
                  )}
                </Fragment>
              ) : (
                <span>{turn.content}</span>
              )}
            </div>
          ))}
          {this.renderAffordance()}
        </div>

        <form class="composer" onSubmit={this.submit}>
          <input
            type="text"
            name="message"
            ref={el => (this.inputEl = el)}
            disabled={!typing}
            placeholder={typing ? 'Posez votre question…' : 'Choisissez une option ci-dessus'}
          />
          <button type="submit" disabled={!typing}>Envoyer</button>
        </form>

        {this.path.length > 0 && (
          <button type="button" class="link restart" onClick={this.restart}>
            Changer de thème
          </button>
        )}
      </Host>
    );
  }
}
