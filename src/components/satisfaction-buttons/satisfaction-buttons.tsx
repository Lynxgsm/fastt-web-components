import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'satisfaction-buttons',
  styleUrl: 'satisfaction-buttons.css',
  shadow: true,
})
export class SatisfactionButtons {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
