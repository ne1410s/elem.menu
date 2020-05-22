# @ne1410s/demo
## A lightweight and customisable context menu.
```html
<ne14-menu mode="dark">
  <li>Hello world</li>
  <li class="split">
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
 - Offers a "dark mode"

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
     - Icons are unicode charset hex references, specified on the `<li>` as either `data-char-left` / `data-char-right`. If present, these supersede images. If *not* present: ...
     - The first nested `<img>` (to not have a `right` class) is used on the left
     - The first nested `<img class='right'>` is used on the right
   - Use `aria-keyshortcuts` to show a command shortcut (this is *not* implemented by this component however, it is just to display anything that has been)
  
NB: To extend this library, or import it in node js, use: *npm i -S @ne1410s/menu*

### Attributes
- **mode**: Uses dark mode if 'dark'. Anything else uses normal mode.

### Events
```javascript
const menu = document.querySelector('ne14-menu');

menu.addEventListener('itemselect', event => {
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
- `set` **mode** (string): Sets the display mode (either 'dark' or else normal)
