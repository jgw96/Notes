import { Component } from '@stencil/core';


@Component({
  tag: 'app-header',
  styleUrl: 'app-header.css',
  shadow: true
})
export class AppHeader {

  render() {
    return (
      <header>
        <slot></slot>
        <h1>Audio Notes</h1>
      </header>
    );
  }
}
