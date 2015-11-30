![Schema of Teleporter.js](http://vkammerer.github.io/teleporter/images/schema.png?v=2)  

Teleporter is a small library that animates DOM elements with "transform", while getting their size and position from usual CSS properties (properties that trigger the 'Layout' or 'Paint' phases of the [browser rendering pipeline](http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#The_main_flow)).

Original inspiration comes from the hack explained by Paul Lewis: [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/).

## Example
[Codepen demo](http://codepen.io/vkammerer/pen/ZbPdmN)
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
If you have to support all browsers, you need to install the [Promise](https://github.com/jakearchibald/es6-promise), [Web Animations](https://github.com/web-animations/web-animations-js) and [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) polyfills. A version of teleporter bundles everything in one file.
```html
<script src="teleporter-global-polyfilled.js"></script>
```

## API
### Basic
```javascript
var myElement = new Teleporter('#myid');
myElement.teleport('state1');
```
This will animate your element from its current size and position to those of the 'state1' class.

### Constructor
```javascript
var myElement = new Teleporter({
  selector: '#myid', // passed to document.querySelector
  sizeClass: 'maximalClass', // to compute size of element
  animation: {
    duration: 800, // default animation time
    easing: 'linear' // default animation easing
  }
});
```
**'sizeClass'**  
By default, the library will calculate the maximal width and height that the element will have for all steps of the teleportation, and use it to create the rasterized image that will be displayed.  
So for example, if you have the following CSS rules:
```css
#example {
  width: 400px;
  height: 100px;
}
.state1 {
  width: 200px;
  height: 300px;
}
```
then your element will be given the following attributes:
```css
{
  width: 400px;
  height: 300px;
}
```
and then modified via 'transform' to be given the size and position of the steps in your teleportation.  

The 'sizeClass' attribute allows you to overwrite that behaviour, by applying a class to compute the size of the rasterized image. Note that the transformation is applied immediately, even if you do not teleport the element.  

The sizeClass property can be changed after initialization with the method 'setSizeClass' (see under).

**'animation'**  
The 'animation' attribute will be used by default for all upcoming teleportations, and will ultimately be passed to [Element.animate](http://w3c.github.io/web-animations/).


### Methods
**'teleport'**  
The argument passed to the 'teleport' method can be a String, an Object, or an Array.
It will be normalized to an Array, so that:
```javascript
myElement.teleport('state1')
```
is equivalent to:
```javascript
myElement.teleport({class: 'state1'})
```
which is equivalent to:
```javascript
myElement.teleport([{{class: ''}}, {class: 'state1'}]);
```  
Each object in the array represents a step of the teleportation. If only one String or Object is passed, it is assumed that the first step is the current state.  
The objects of the array have the following format:
```javascript
{
  class: 'state1', // class of the step
  animation: { // animation to perform to this step (see 'Constructor options' > 'animation' above)
    duration: 800,
    easing: 'linear'
  }
}
```
The method returns a Promise, which will resolve once the animation has finished. You may use it to perform other DOM manipulation:
```javascript
myElement.teleport('state1').then(function(){
	var el = document.querySelector('#myid');
	el.innerHTML = 'Some other content';
})
```

**'setSizeClass'**  
```javascript
myElement.setSizeClass('maximalClass');
```
Sets the 'sizeClass' attribute (see 'Constructor options' > 'sizeClass' above) and applies transformation to the element.
## License
The MIT License (MIT)

Copyright (c) 2015 Vincent Kammerer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
