# @ne1410s/demo
## A custom element implementation of a context menu.
```html
<ne14-menu mode="dark">
  <li>Hello world</li>
</ne14-menu>
```
- **Use:** `<script src="PATH_TO_UMD_SCRIPT"></script>`
- **Extend:** *npm i -S @ne1410s/menu*
### Attributes
```html
<ne14-menu>
  <li>YO' STUFF 1</li>
  <li>YO' STUFF 2</li>
</ne14-menu>
```
- **mode**: Optional theme.

### Events
```javascript
const menu = document.querySelector('ne14-menu');

menu.addEventListener('...', () => {
  console.log('Event fired!');
});
```
- *There are no bespoke events raised in the internal workings of this element*
### Methods
- *There are no bespoke methods exposed in this element*
### Properties
- `set` **mode** (number): Sets the attribute with the corresponding value
