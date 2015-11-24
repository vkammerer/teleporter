Hardware Accelerated Animations with boring CSS properties.  

## What?
Teleporter is a small library that animates DOM elements with 'transform', while getting their size and position from usual CSS properties (properties that trigger the 'Layout' or 'Paint' phases of the [browser rendering pipeline](http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)).

| Usual CSS properties | 'transform' CSS property |
| :------------- | :------------- |
| example: {left: 200px} | example: {transform:'translateX(200px)'} |
| Easy to use for layout. | Hard to use for layout |
| Janky animations | Smooth animations |

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
If you have to support all browsers, you need to install the [Promise](https://github.com/jakearchibald/es6-promise) and [Web Animations](https://github.com/web-animations/web-animations-js) polyfills. A version of teleporter bundles everything in one file.
```html
<script src="teleporter-global-polyfilled.js"></script>
```

## API
### Basic
```
var myElement = new Teleporter('#myid');
myElement.teleport('myclass');
```
This will teleport your element from its current state to the state corresponding to the 'myclass' class.

### Constructor

**'animation'**  
```
var myElement = new Teleporter({
  selector: '#myid',
  animation: {
    duration: 800, // default animation time
    easing: 'linear' // default animation easing
  }
});
```
The 'animation' attribute will be used by default for all upcoming teleportations, and will ultimately be passed to [Element.animate](http://w3c.github.io/web-animations/).

**'dimensionsClass'**  
```javascript
var myElement = new Teleporter({
  selector: '#myid',
  dimensionsClass: 'maximalClass'
});
```
By default, the library will calculate the maximal width and height that the element will have for all steps of the teleportation, and use it to create the rasterized image that will be displayed.  
So for example, if you have set the following CSS rules
```css
#example {
  width: 400px;
  height: 100px;
}
.myclass {
  width: 200px;
  height: 300px;
}
```
then your element will be given the following attributes
```css
{
  width: 400px;
  height: 300px;
}
```
... and then transformed to be given the size and position of the steps in your teleportation.  
The 'dimensionsClass' attribute allows you to overwrite that behaviour, by specifying the class that will be used to compute the size of the rasterized image.  
Note that the transformation is applied immediately, even if you do not teleport the element.

### Methods
**'teleport'**  
The argument passed to the 'teleport' method can be a String, an Object, or an Array.
It will be normalized to an Array, so that:
```javascript
myElement.teleport('myclass')
```
is equivalent to:
```javascript
myElement.teleport({class: 'myclass'})
```
which is equivalent to:
```javascript
myElement.teleport([{{class: ''}}, {class: 'myclass'}]);
```  
Each object in the array represents a step of the teleportation. If only one String or Object is passed, it is assumed that the first step is the current step.  
The objects of the array have the following format:
```javascript
{
  class: 'myclass', // class of the step
  animation: { // animation to perform to this step (see 'Constructor options' > 'animation' above)
    duration: 800,
    easing: 'linear'
  }
}
```
The method returns a Promise object, which will resolve once the animation has finished. You may use it to perform other DOM manipulation:
```javascript
myElement.teleport('myclass').then(function(){
	var el = document.querySelector('#myid');
	el.innerHTML = 'Some other content';
})
```

**'setDimensionsClass'**  
```javascript
myElement.setDimensionsClass('maximalClass');
```
Sets the 'dimensionsClass' attribute (see 'Constructor options' > 'dimensionsClass' above) and applies transformation to the element.
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
