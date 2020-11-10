# @ne1410s/demo

## A lightweight and customisable context menu.

```html
<ne14-menu>
  <li>Hello world</li>
  <li class="split"></li>
  <li>
    <span>Nested Item</span>
    <ul>
      <li>Item 1</li>
      <li class="disabled">Item 2</li>
    </ul>
  </li>
</ne14-menu>
```

### What Does It Do?

- Provides a context menu with sub-menu support, based on original markup
- Supports `<a href target>` tags to navigate in new tab or in current tab accordingly
- Appears and behaves like a browser's "default" context menu
- Supports item disabling and hiding alike
- Provides splitters for logical grouping, the presence of which is monitored to strip out orphaned zones / multiple splitters from appearing
- Supports unicode charset (hex) for icons at either side of the item text, and/or `<img>` tags
- Displays shortcut keys (the implementation of which is left to the author)
- Inherits the font family and size (size is ~2/3 that of the html root)

### How Do I Use It?

1. Include the umd script in the head `<script src="PATH_TO_UMD_SCRIPT"></script>`
2. Declare (or programatically construct) your markup (using below guide)
   - Whatever click handling you have will be invoked when items are clicked
3. Position the menu html inside whichever container element(s) the menu applies
   - **Yes you can easily have different menus for different zones!**
4. If your menu doesn't need to change, that's all you need to do
5. But if you did wish to effect a change dynamically, then just alter the structure accordingly and call `.reload()` on the menu instance

### Guidance, Please

- Specify only `<li>` nodes as direct descendants
- Provide some kind of node text (e.g. either directly or in a `<p>` or `<span>`)
- Use `li.split` to make a divider line
- Use `li.disabled` to "grey-out" an item
- Use `li.hidden` to conceal an item entirely
- Images & font icons can be included either side of the menu item text:
  - Icons are unicode charset hex references, specified on the `<li>` as either `data-char-left` / `data-char-right`. If present, these supersede images. If _not_ present: ...
  - The first nested `<img>` (to not have a `right` class) is used on the left
  - The first nested `<img class='right'>` is used on the right
- Use `aria-keyshortcuts` to show a command shortcut (this is _not_ implemented by this component however, it is just to display anything that has been)

NB: To extend this library, or import it in node js, use: _npm i -S @ne1410s/menu_

### Attributes

- _There are no bespoke attributes exposed in this element_

### Events

```javascript
const menu = document.querySelector('ne14-menu');

// As mentioned, each item click is propagated on the original element.
// Instead of (or as well as) dedicated handling, one may also proceed via the
// following generic selection handler
menu.addEventListener('itemselect', (event) => {
  console.log('Item Selected!', event);
});
```

- `itemselect` occurs when an item is clicked. The custom event detail contains the text of the menu item, its in-menu reference and the original html element
- `itemhover` and `itemunhover` occur when mouse enters or leaves an item
- `menuopen` and `menuclose` occur when the menu is opened or closed

### Methods

- `open()` Opens the menu (after closing any others)
- `close()` Closes the menu
- `reload()` Recreates the menu according to its current content

### Properties

- _There are no bespoke properties exposed in this element_

### CSS Variables

Some degree of custom styling can be optionally provided, by way of css variables:

```css
/* Example of 'dark mode': */
ne14-menu {
  --bg: #333;
  --border: 1px solid #888;
  --box-shadow: 2px 2px 3px #333;
  --hover-item-bg: #666;
  --fg: #eee;
  --disabled-fg: #666;
}
```

- **`--bg`** _Background for the menu. Defaults to: `#fff`_
- **`--border`** _Border for the menu. Defaults to: `1px solid #bbb`_
- **`--box-shadow`** _Box shadow for the menu. Defaults to: `2px 2px 3px #888`_
- **`--font`** _Font for the menu. Defaults to: `0.65em inherit`_
- **`--fg`** _Color for menu items. Defaults to: `#000`_
- **`--disabled-fg`** _Color for disabled menu items. Defaults to: `#bbb`_
- **`--split-border`** _Border for split lines. Defaults to: `--border` else `1px solid #bbb`_
- **`--hover-item-bg`** _Background color for items in the hover state. Defaults to: `#bbb`_
