# PostCSS Aspect Ratio Polyfill

A PostCSS plugin to support [`aspect-ratio`](https://drafts.csswg.org/css-sizing-4/#aspect-ratio) property.

## Install

```bash
npm i -D postcss-aspect-ratio-polyfill
```

## Usage

```js
const postcss = require('postcss')

const output = postcss()
  .use(require('postcss-aspect-ratio-polyfill'))
  .process(require('fs').readFileSync('input.css', 'utf8'))
  .css
```

### Basis

input:

```css
.aspect-ratio-box {
  aspect-ratio: 16 / 9;
}
```

output:

```css
.aspect-ratio-box::before {
  float: left;
  padding-top: 56.25%;
  content: '';
}
.aspect-ratio-box::after {
  display: block;
  content: '';
  clear: both;
}
```

### With `object-fit`

```html
<div class="aspect-ratio-box">
  <img src="https://picsum.photos/1280/720">
</div>
```

input:

```css
.aspect-ratio-box {
  position: relative;
  max-width: 500px;
  aspect-ratio: 16 / 9;
}
.aspect-ratio-box > img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

output:

```css
.aspect-ratio-box {
  position: relative;
  max-width: 500px;
}
.aspect-ratio-box::before {
  float: left;
  padding-top: 56.25%;
  content: '';
}
.aspect-ratio-box::after {
  display: block;
  content: '';
  clear: both;
}
.aspect-ratio-box > img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```