import { q, ChainSource } from '@ne1410s/dom';
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
        
        // close all menus
        const doc = this.parentElement.getRootNode() as Document;
        doc.querySelectorAll('ne14-menu').forEach((m: NeMenu) => m.close());

        // style this one as open
        this.top.classList.add('open');
        break;
    }
  }

  connectedCallback() {
    setTimeout(() => this.reload());
    q(this.parentNode).on('contextmenu', (e: MouseEvent) => this.onParentContext(e));
    q(this).on('mousedown wheel', e => e.stopPropagation());
    q(window).on('mousedown resize wheel', () => this.close());
  }

  disconnectedCallback() {
    // todo: prevent event handler build-up (... observables?..)
    console.warn('TODO: prevent event handler build-up');
  }

  /** Opens the menu.  */
  open(): void {
    this.setAttribute('open', '');
  }

  /** Closes the menu. */
  close(): void {
    this.removeAttribute('open');
    this.top.classList.remove('open');
  }

  /** Reloads active contents based on client dom. */
  reload(): void {
    q(this.top).empty().append(...this.walk(this));
  }

  private onParentContext(event: MouseEvent) {

    if (!this.parentElement) return;

    // prevent default (browser menu), and event bubbling
    event.preventDefault();
    event.stopPropagation();

    // update position
    this.top.style.left = `${event.clientX}px`;
    this.top.style.top = `${event.clientY}px`;

    // open
    this.open();
  }

  private walk(ul: ParentNode): ChainSource[] {
    return Array
      .from(ul.children)
      .filter(c => c instanceof HTMLLIElement && c.textContent)
      .map((li: HTMLLIElement) => {

        const children = Array.from(li.children);
        const a = children.find(n => n instanceof HTMLAnchorElement) as HTMLAnchorElement;

        const classes = [] as string[];
        if (li.classList.contains('disabled')) classes.push('disabled');
        if (a?.target === '_blank') classes.push('clickoff');

        const $domItem = q({
          tag: 'li',
          text: li.textContent,
          attr: { class: classes.join(' ') },
          evts: { click: a?.click ?? li.click },
        });

        const ul = children.find(n => n instanceof HTMLUListElement) as HTMLUListElement;
        if (ul) {
          $domItem.append(...this.walk(ul));
        }
  
        return $domItem.get(0);
      });
  }
}
