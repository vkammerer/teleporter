![Schema of Teleporter.js](http://vkammerer.github.io/teleporter/public/images/schema.png?v=4)  
Teleporter is a small library that animates DOM elements with "transform", while getting their size and position from usual CSS properties (properties that trigger the 'Layout' or 'Paint' phases of the [browser rendering pipeline](http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#The_main_flow)).

Original inspiration comes from the hack explained by Paul Lewis: [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/).  

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
  sizeClass: 'maximal-class', // to compute size of element
  ratioSide: 'width', // to keep the aspect ratio of sizeClass
  animation: {
    duration: 800, // default animation time
    delay: 0, // default delay time
    easing: 'linear' // default animation easing
  }
});
```
**'selector'**  
The 'selector' attribute is passed to document.querySelector.  

**'sizeClass'**  
The 'sizeClass' attribute is the class applied to compute the size of the rasterized image.  

**'ratioSide'**  
If you want the element to keep the aspect ratio of the sizeClass dimensions,
you can define which side (either 'width' or 'height') should be adjusted.  

**'animation'**  
The 'animation' attribute will be used by default for all upcoming teleportations,
and will ultimately be passed to [Element.animate](http://w3c.github.io/web-animations/).  

### Methods
**'update'**  
The method will reinitialize the element.
```javascript
myElement.update();
```
You may use it if you perform DOM manipulation on the original node (such as adding a class).
```javascript
document.querySelector('#myid').classList.add('my-favourite-class');
myElement.update();
```
You may also change the 'sizeClass' attribute dynamically after initialization:
```javascript
myElement.sizeClass = 'new-class';
myElement.update();
```

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
myElement.teleport([{class: ''}, {class: 'state1'}]);
```  
Each object in the array represents a step of the teleportation.
If only one String or Object is passed, it is assumed that the first step is the current state.  
The objects of the array have the following format:
```javascript
{
  class: 'state1', // class of the step
  opacity: '1', // opacity to and from this step
  rotate: '0deg', // rotation angle to and from this step
  animation: { // animation to perform to this step (see 'Constructor options' > 'animation' above)
    duration: 800,
    delay: 0,
    easing: 'linear'
  }
}
```
The method returns a Promise, which will resolve once the animation has finished.
You may use it to perform other DOM manipulation:
```javascript
myElement.teleport('state1').then(function(){
	var el = document.querySelector('#myid');
	el.innerHTML = 'Some other content';
})
```

**'saveSteps'**  
When the 'teleport' method is called, it performs a set of synchronous DOM operations to measure the size and position of each step.
The measurements are saved in the 'store' attribute, so that future teleport calls can skip these manipulations.  
If you wish to perform these expensive operations in advance, you can use the 'saveSteps' method:  
```javascript
myElement.saveSteps(['state2', {sizeClass: 'state3', ratioSide: 'width'}]);
document.querySelector('#myid').addEventListener('click', function(){
  // No synchronous DOM operation here, so the animation will be supa smooth!
  myElement.teleport('state2', {sizeClass: 'state3', ratioSide: 'width'});
})
```
## Gotchas
### DOM structure
Upon initialization, the DOM structure of a teleporter element is modified from the state:
```html
<div id="myid">
  <div class="content">Blah</content>
</div>
```  
to the state:
```html
<div id="myid" class="teleporter-idle">
  <div class="teleporter-wrapper">
    <div class="content">Blah</content>
  </content>
</div>
```
The wrapper div ('.teleporter-wrapper') will be animated via 'transform',
while the original teleporter element ('#myid') will remain unchanged.
This means that is it is good practice to encapsulate your content
within a child div, as in the previous example, so that:
- the teleporter element is used to define the position and size.
- the inner element is used to define the design properties (such as backgrounds or borders)
and include the content.  

### Browser support
Teleporter animates elements via [Element.animate](http://w3c.github.io/web-animations/), which [only Chrome](http://caniuse.com/#feat=web-animation) currently supports natively.  
While a [polyfill](https://github.com/web-animations/web-animations-js) is available,
its performance is often far from acceptable for sites that need to support all browsers.
Safari is terrible, but [what can we do really](http://nolanlawson.com/2015/06/30/safari-is-the-new-ie/)?  
The good news is that most mobile browsers are chromium based, and that [Chrome now represents over 50% of browser usage](http://gs.statcounter.com) worldwide.
## Examples
#### On Codepen
A few demos are hosted on Codepen.  
Warning: [these demos have cats in them](http://codepen.io/collection/AvBoZo/).  

#### Other demos
If you made something with Teleporter you would like to share here, please submit a pull request to '[examples.md](https://github.com/vkammerer/teleporter/blob/master/docs/examples.md)'.  
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
