import { Component, Env, Host, Prop, h } from '@stencil/core';
import { handleFeedback } from '../../utils/api-service';

@Component({
  tag: 'satisfaction-buttons',
  styleUrl: 'satisfaction-buttons.css',
  shadow: true,
})
export class SatisfactionButtons {
  @Prop() apiEndpoint: string = Env.API_URL;
  @Prop() conversationId: string = '';

  private handleThumbsUp = () => {
    handleFeedback(1, this.apiEndpoint, this.conversationId, () => {
      console.log('Thumbs up clicked');
    });
  };

  private handleThumbsDown = () => {
    handleFeedback(0, this.apiEndpoint, this.conversationId, () => {
      console.log('Thumbs down clicked');
    });
  };

  render() {
    return (
      <Host>
        <div class="satisfaction-container">
          <div class="satisfaction-buttons">
            <button
              title="Réponse utile"
              class="satisfaction-btn thumbs-up"
              onClick={this.handleThumbsUp}
              aria-label="Réponse utile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up-icon lucide-thumbs-up">
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
            </button>
            <button
              title="Réponse inutile"
              class="satisfaction-btn thumbs-down"
              onClick={this.handleThumbsDown}
              aria-label="Réponse pas utile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-down-icon lucide-thumbs-down">
                <path d="M17 14V2" />
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
              </svg>
            </button>
          </div>
        </div>
      </Host>
    );
  }
}
