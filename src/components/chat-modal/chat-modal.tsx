import { Component, Env, h, Host, Prop } from '@stencil/core';
import { loadFonts } from '../../utils/fonts';

/**
 * Panneau de chat intégré dans la page.
 *
 * Ne porte que son chrome : tout le parcours (arbre guidé, réponses
 * pré-enregistrées, vote, saisie libre) vit dans `chat-conversation`, partagé
 * avec `chat-widget`. Les deux composants étaient auparavant dupliqués à 90 %,
 * et leurs divergences étaient des bogues, pas des fonctionnalités.
 */
@Component({
  tag: 'chat-modal',
  styleUrl: 'chat-modal.css',
  shadow: true,
})
export class ChatModal {
  @Prop() modalTitle: string = 'Que puis-je faire pour vous ?';
  @Prop() apiEndpoint: string = Env.API_URL;

  componentWillLoad() {
    loadFonts();
  }

  render() {
    return (
      <Host>
        <div class="chat-container">
          <div class="modal-header">
            <span class="modal-title">{this.modalTitle}</span>
          </div>
          <chat-conversation apiEndpoint={this.apiEndpoint} />
        </div>
      </Host>
    );
  }
}
