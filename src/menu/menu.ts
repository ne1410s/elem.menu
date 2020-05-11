import { q } from '@ne1410s/dom';
import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './menu.html';
import stylesUrl from './menu.css';

export class NeMenu extends CustomElementBase {

  public static readonly observedAttributes = ['mode', 'open'];

  private readonly top: HTMLUListElement;

  constructor() {
    super(stylesUrl, markupUrl, 'open');
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

    console.log(this.root.querySelector('slot').assignedNodes());
    console.log(this.shadowRoot.querySelector('slot').assignedNodes());

    q(this.parentNode).on('contextmenu', (e: MouseEvent) => this.onParentContext(e));
    q(this).on('mousedown wheel', e => e.stopPropagation());
    q(window).on('mousedown resize wheel', () => this.close());
  }

  disconnectedCallback() {
    // todo: prevent event handler build-up (... observables?..)
    console.warn('TODO: prevent event handler build-up');
  }

  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
    this.top.classList.remove('open');
  }

  private onParentContext(event: MouseEvent) {

    if (!this.parentElement) return;

    // prevent default (browser menu), and event bubbling
    event.preventDefault();
    event.stopPropagation();

    // close all windows
    const doc = this.parentElement.getRootNode() as Document;
    doc.querySelectorAll('ne14-menu').forEach((m: NeMenu) => m.close());

    // update position
    this.top.style.left = `${event.clientX}px`;
    this.top.style.top = `${event.clientY}px`;

    // open this one
    this.open();
  }
}
