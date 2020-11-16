import { q, ChainSource } from '@ne1410s/dom';
import { CustomElementBase, decode, reduceCss, reduceHtml } from '@ne1410s/cust-elems';

import markupUrl from './menu.html';
import stylesUrl from './menu.css';
import { MenuEventDetail } from '../models';

export class NeMenu extends CustomElementBase {
  private static readonly Css = reduceCss(decode(stylesUrl));
  private static readonly Html = reduceHtml(decode(markupUrl));
  private static readonly CHAR_REF_REGEX = /^[0-9a-f]{4,5}$/i;

  private readonly top: HTMLUListElement;
  private _connected: boolean;

  constructor() {
    super(NeMenu.Css, NeMenu.Html);
    this.top = this.root.querySelector('ul');
  }

  connectedCallback() {
    if (!this._connected) {
      setTimeout(() => this.reload());
      q(this.parentNode).on('contextmenu', (e: MouseEvent) => this.onParentContext(e));
      q(this, this.parentNode).on('contextmenu wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      q(this).on('mousedown', (e) => e.stopPropagation());
      q(window).on('mousedown resize wheel', () => this.close());

      this._connected = true;
    }
  }

  /** Opens the menu.  */
  open(): void {
    // close all menus
    const doc = this.parentElement.getRootNode() as Document;
    doc.querySelectorAll('ne14-menu').forEach((m: NeMenu) => m.close());

    // style this one as open
    this.top.classList.add('open');
    q(this).fire('menuopen');
  }

  /** Closes the menu. */
  close(): void {
    if (this.top.classList.contains('open')) {
      this.top.classList.remove('open');
      q(this).fire('menuclose');
    }
  }

  /** Reloads active contents based on client dom. */
  reload(): void {
    q(this.top)
      .empty()
      .append(...this.walk(this, false));
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

  private walk(ul: ParentNode, parentDisabled: boolean, ref = ''): ChainSource[] {
    let levelItemNo = 0;
    return Array.from(ul.children)
      .filter(
        (c) =>
          c instanceof HTMLLIElement &&
          !c.classList.contains('hidden') &&
          (c.textContent || c.classList.contains('split'))
      )
      .reduce((acc, li: HTMLLIElement) => {
        const children = Array.from(li.children).map((el) => el as HTMLElement);
        const a = children.find((n) => n instanceof HTMLAnchorElement) as HTMLAnchorElement;
        const ul = children.find((n) => n instanceof HTMLUListElement) as HTMLUListElement;
        const isSplit = li.classList.contains('split');
        const isGrouper = !isSplit && ul && ul.querySelector('li');
        const isDisabled = !isSplit && (parentDisabled || li.classList.contains('disabled'));
        const aChildren = Array.from(a?.children || []).map((el) => el as HTMLElement);
        const imgs = children
          .concat(aChildren)
          .filter((n) => n instanceof HTMLImageElement)
          .map((n) => n as HTMLImageElement);

        if (!isSplit) levelItemNo++;

        const classes = [] as string[];
        if (isSplit) classes.push('split');
        else {
          if (isDisabled) classes.push('disabled');
          if (isGrouper) classes.push('group');
          if (a?.target === '_blank') classes.push('click-out');
          else if (a) classes.push('click-in');
        }

        const bestTextNode = [...children, li].find((c) => c.innerText);
        const bestText = isSplit ? null : bestTextNode?.innerText ?? `Item ${levelItemNo}`;
        const shortcut = isSplit || isGrouper ? null : li.getAttribute('aria-keyshortcuts');
        const liRef = `${ref}${levelItemNo}`;
        const eventDetail: MenuEventDetail = { ref: liRef, title: bestText, origin: a || li };

        const handleClick = () => {
          if (!isDisabled && !isGrouper && !isSplit) {
            eventDetail.origin.click();
            q(this).fire('itemselect', eventDetail);
            this.close();
          }
        };

        const handleMouseEnter = (e: Event) => {
          if (!isDisabled && !isSplit) {
            const domLi = e.target as HTMLLIElement;
            if (isGrouper) {
              const domUl = Array.from(domLi.children).find((n) => n instanceof HTMLUListElement);
              const liRect = domLi.getBoundingClientRect();
              domUl.classList.toggle(
                'nestle',
                liRect.right + domUl.clientWidth + 2 > window.innerWidth
              );
            }

            domLi.classList.add('hover');
            q(this).fire('itemhover', eventDetail);
          }
        };

        const handleMouseLeave = (e: Event) => {
          if (!isDisabled && !isSplit) {
            (e.target as Element).classList.remove('hover');
            q(this).fire('itemunhover', eventDetail);
          }
        };

        const $domItem = q({ tag: 'li' })
          .attr('class', classes.length ? classes.join(' ') : null)
          .attr('aria-keyshortcuts', shortcut)
          .on('click contextmenu', handleClick)
          .on('mouseenter', handleMouseEnter)
          .on('mouseleave', handleMouseLeave);

        const charLeft = li.dataset.charLeft;
        const charRight = li.dataset.charRight;
        const imgLeft = imgs.find((i) => !i.classList.contains('right'));
        const imgRight = imgs.find((i) => i.classList.contains('right'));

        if (!isSplit && !isGrouper && bestText) {
          if (NeMenu.CHAR_REF_REGEX.test(charLeft))
            $domItem.append(`<span class='icon left'>&#x${charLeft};</span>`);
          else if (charLeft)
            console.warn(`ne14-menu: Bad hex code '${charLeft}' to left of '${bestText}'.`);
          else if (imgLeft) $domItem.append(`<img class='icon left' src='${imgLeft.src}'/>`);

          if (NeMenu.CHAR_REF_REGEX.test(charRight))
            $domItem.append(`<span class='icon right'>&#x${charRight};</span>`);
          else if (charRight)
            console.warn(`ne14-menu: Bad hex code '${charRight}' to right of '${bestText}'.`);
          else if (imgRight) $domItem.append(`<img class='icon right' src='${imgRight.src}'/>`);
        }

        if (bestText) $domItem.append({ tag: 'p', text: bestText });
        if (shortcut) $domItem.append({ tag: 'p', text: shortcut });
        if (isGrouper)
          $domItem.appendIn({ tag: 'ul' }).append(...this.walk(ul, isDisabled, `${liRef}-`));

        // Do not push two consecutive splits
        if (!isSplit || !acc[acc.length - 1]?.classList?.contains('split')) {
          acc.push($domItem.elements[0] as HTMLLIElement);
        }
        return acc;
      }, [] as HTMLLIElement[]);
  }
}
