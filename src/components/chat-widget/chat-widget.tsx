import { Component, Env, h, Prop, State } from '@stencil/core';
import { loadFonts } from '../../utils/fonts';

/**
 * Bulle flottante et son panneau.
 *
 * Ne porte que son chrome : le parcours vit dans `chat-conversation`, partagé
 * avec `chat-modal`.
 */
@Component({
  tag: 'chat-widget',
  styleUrl: 'chat-widget.css',
  shadow: true,
})
export class ChatWidget {
  @Prop() apiEndpoint: string = Env.API_URL;
  @State() isChatContainerVisible: boolean = true;

  componentWillLoad() {
    loadFonts();
  }

  private toggle = () => {
    this.isChatContainerVisible = !this.isChatContainerVisible;
  };

  render() {
    return [
      <div class={{ 'chat-widget-container': true, hide: !this.isChatContainerVisible }}>
        <div class="chat-header">
          <h3 class="chat-title">Que puis-je faire pour vous ?</h3>
          <button class="close-button" onClick={this.toggle} aria-label="Fermer">
            ×
          </button>
        </div>
        <chat-conversation apiEndpoint={this.apiEndpoint} />
      </div>,

      <button class="chat-toggler" onClick={this.toggle} aria-label="Ouvrir le chat">
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
