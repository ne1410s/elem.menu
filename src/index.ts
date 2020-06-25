import { NeMenu } from './menu/menu';

if ('customElements' in window) {
  window.customElements.define('ne14-menu', NeMenu);
}

export { NeMenu as ContextMenu };
