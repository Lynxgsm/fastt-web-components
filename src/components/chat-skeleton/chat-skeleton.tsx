import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'chat-skeleton',
  styleUrl: 'chat-skeleton.css',
  shadow: true,
})
export class ChatSkeleton {
  render() {
    return (
      <Host>
        <div class='skeleton-container'>
          <div class='skeleton-typing'>
            <div class='skeleton-dot'></div>
            <div class='skeleton-dot'></div>
          </div>
        </div>
      </Host>
    );
  }
}
