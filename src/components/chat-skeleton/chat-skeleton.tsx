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
        <slot></slot>
      </Host>
    );
  }
}
