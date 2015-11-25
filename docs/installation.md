## Installation
Get it from npm.
```javascript
npm install teleporter --save
```
## Usage
Import it as ES2015 module.
```javascript
import Teleporter from 'teleporter';
```
Or as commonjs module.
```javascript
var Teleporter = require('teleporter');
```
A version with a global object is also available.
```html
<script src="teleporter-global.js"></script>
```
If you have to support all browsers, you need to install the [Promise](https://github.com/jakearchibald/es6-promise), [Web Animations](https://github.com/web-animations/web-animations-js) and [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) polyfills. A version of teleporter bundles everything in one file.
```html
<script src="teleporter-global-polyfilled.js"></script>
```

