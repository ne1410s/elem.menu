import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './menu.html';
import stylesUrl from './menu.css';

export class NeMenu extends CustomElementBase {

  public static readonly observedAttributes = ['mode', 'open'];

  private readonly top: HTMLUListElement;

  constructor() {
    super(stylesUrl, markupUrl);

    this.top = this.root.querySelector('ul');
  }

  get mode(): string { return this.getAttribute('mode'); }
  set mode(value: string) {
    if (value) this.setAttribute('mode', value);
    else this.removeAttribute('mode');
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {

      case 'mode':
        // ...
        break;

      case 'open':
        this.top.classList.add('open');
        break;
    }
  }

  connectedCallback() {

    // Open: when right-click on container
    this.parentNode.addEventListener('contextmenu', event => {
      if (this.parentNode) { // only invoke if still attached
        event.preventDefault(); // prevent browser menu
        event.stopPropagation(); // no bubble
        this.closeGlobal();
        this.open();
      }
    });

    // Close: when click pretty much anywhere...
    window.addEventListener('click', () => this.close());
    window.addEventListener('contextmenu', () => this.close());

    // ...except from within
    this.addEventListener('click', event => event.stopPropagation());
  }

  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
    this.top.classList.remove('open');
  }

  private closeGlobal(): void {
    const doc = this.parentElement.getRootNode() as Document;
    doc.querySelectorAll('ne14-menu').forEach((m: NeMenu) => m.close());
  }
}
