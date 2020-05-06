import { ContextMenu } from './menu/menu';

if ('customElements' in window) {
  window.customElements.define('ne14-menu', ContextMenu);
}

export { ContextMenu };