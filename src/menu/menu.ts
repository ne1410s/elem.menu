import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './menu.html';
import stylesUrl from './menu.css';

export class ContextMenu extends CustomElementBase {

  public static readonly observedAttributes = ['mode'];

  constructor() {
    super(stylesUrl, markupUrl);
  }

  set mode(value: string) {
    this.setAttribute('mode', value);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'mode':
        // ...
        break;
    }
  }

  connectedCallback() {

    // Prevent self-initiated clicks from necessarily closing
    this.addEventListener('click', event => event.stopPropagation())

    // Any other clicks result in close
    window.addEventListener('click', () => this.close());

    // Right-clicks (in parent) result in open
    this.parentNode.addEventListener('contextmenu', event => {
      if (this.parentNode) {
        event.preventDefault();
        this.open();
      }
    });
  }

  open() {
    console.log('open me!');
  }

  close() {
    console.log('shut me!');
  }
}
