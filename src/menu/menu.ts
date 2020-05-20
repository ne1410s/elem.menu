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
    q(this, this.parentNode).on('contextmenu wheel', e => { e.preventDefault(); e.stopPropagation(); });
    q(this).on('mousedown', e => e.stopPropagation());
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
    q(this.top).empty().append(...this.walk(this, false));
  }

  private onParentContext(event: MouseEvent) {

    if (this.isConnected) {

      // update position (y)
      const y = event.clientY;
      const height = this.top.offsetHeight;
      const posY = y + height + 2 > window.innerHeight ? y - height : y;
      this.top.style.top = `${Math.max(0, posY)}px`;

      // update position (x)
      const x = event.clientX;
      const width = this.top.offsetWidth;
      const posX = x + width + 2 > window.innerWidth ? x - width : x;
      this.top.style.left = `${Math.max(0, posX)}px`;
      
      // open
      this.open();
    }
  }

  private onItemSelect(ref: string, originator: HTMLElement) {
    originator.click();
    q(this).fire('itemselect', ref);
    this.close();
  }

  private walk(ul: ParentNode, parentDisabled: boolean, ref = ''): ChainSource[] {
    let levelItemNo = 0;
    return Array
      .from(ul.children)
      .filter(c => c instanceof HTMLLIElement && (c.classList.contains('split') || c.textContent))
      .map((li: HTMLLIElement) => {

        const children = Array.from(li.children).map(el => el as HTMLElement);
        const a = children.find(n => n instanceof HTMLAnchorElement) as HTMLAnchorElement;
        const ul = children.find(n => n instanceof HTMLUListElement) as HTMLUListElement;
        const aChildren = Array.from(a?.children || []).map(el => el as HTMLElement);
        const img = children.concat(aChildren)
          .find(n => n instanceof HTMLImageElement) as HTMLImageElement;
        const isSplit = li.classList.contains('split');
        const isGrouper = !isSplit && ul && ul.querySelector('li');
        const isDisabled = !isSplit && (parentDisabled || li.classList.contains('disabled'));
        const hasIcon = !isSplit && img;
        if (!isSplit) levelItemNo++;

        const classes = [] as string[];
        if (isSplit) classes.push('split');
        else {
          if (isDisabled) classes.push('disabled');
          if (isGrouper) classes.push('group');
          if (a?.target === '_blank') classes.push('click-out');
          else if (a) classes.push('click-in');
        }

        const bestTextNode = [...children, li].find(c => c.innerText);
        const bestText = isSplit ? null: bestTextNode?.innerText ?? `Item ${levelItemNo}`;
        const shortcut = isSplit || isGrouper ? null : li.getAttribute('aria-keyshortcuts');
        const liRef = `${ref}${levelItemNo}`;
        const handleClick = () => {
          if (!isDisabled && !isGrouper && !isGrouper) {
            this.onItemSelect(liRef, a || li);
          }
        };
        const handleMouseEnter = (e: Event) => {
          const domLi = e.target as HTMLLIElement;
          if (isGrouper) {
            const domUl = Array.from(domLi.children).find(n => n instanceof HTMLUListElement);
            const liRect = domLi.getBoundingClientRect();
            domUl.classList.toggle('nestle', liRect.right + domUl.clientWidth + 2 > window.innerWidth);
          }

          domLi.classList.toggle('hover', !isSplit && !isDisabled);
        };

        const $domItem = q({ tag: 'li' })
          .attr('class', classes.length ? classes.join(' ') : null)
          .attr('aria-keyshortcuts', shortcut)
          .on('click contextmenu', handleClick)
          .on('mouseenter', handleMouseEnter)
          .on('mouseleave', e => (e.target as Element).classList.remove('hover'));

        if (hasIcon) $domItem.append({ tag: 'img', attr: { src: img.src } });
        if (bestText) $domItem.append({ tag: 'p', text: bestText });
        if (shortcut) $domItem.append({ tag: 'p', text: shortcut });
        if (isGrouper) $domItem.appendIn({ tag: 'ul' }).append(...this.walk(ul, isDisabled, `${liRef}-`));
  
        return $domItem.get(0);
      });
  }
}
