Hardware Accelerated Animations with boring CSS properties.  

## Huh?
- CSS sizing and positioning properties are a great way to define a web layout. Unfortunately, their performance is terrible with animations.  
- CSS transform properties are a great way to smoothly animate an element's position and size. Unfortunately, it can be very challenging or even impossible to compute the value to apply between two states.  

Haa is a small utility that enables you to animate elements with 'transform', while defining their size and position with usual CSS properties.

Original inspiration comes from the hack explained by Paul Lewis: [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/).

## Example
[Codepen demo](http://codepen.io/vkammerer/pen/ZbPdmN)

## Installation
```javascript
npm install haa --save
```

## Usage
The library is written is ES2015 so you can import its module:
```javascript
import Haa from 'haa';
let myHaa = new Haa('#myid');
```
It is also compiled to ES5 via babel and attached to the global object, so you can use it directly in the browser:
```html
<script src="haa-global.js"></script>
<script>
	var myHaa = new Haa('#myid');
</script>
```

## API
#### Basic
```
var myHaa = new Haa('#myid');
myHaa.transition('myclass');
```
This will transition your element from its current state to the state corresponding to the 'myclass' class.

#### Options

**'animation'**
```
var myHaa = new Haa({
  selector: '#myid',
  animation: {
    duration: 800, // default animation time
    easing: 'linear' // default animation easing
  }
});
```
The 'animation' attribute will be used by default for all upcoming transitions, and will ultimately be passed to the [Element.animate](https://developers.google.com/web/updates/2014/05/Web-Animations-element.animate-is-now-in-Chrome-36) options object.

**'dimensionsClass'**
```javascript
var myHaa = new Haa({
  selector: '#myid',
  dimensionsClass: 'maximalClass'
});
```
By default, the library will calculate the maximal width and height that the element will have for all steps of the transition, and use it to create the rasterized image that will be displayed.  
So, if you have set the following CSS rules:
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
then your element will be given the following attributes:
```css
{
  width: 400px;
  height: 300px;
}
```
and then transformed to be given the size and position of the steps in your transition.  
The 'dimensionsClass' attribute allows you to overwrite that behaviour, by specifying the class that will be used to compute the size of the rasterized image.  
Note that the transformation is applied immediately, even if you do not transition the element.

#### Methods
**'transition'**
The argument passed to the 'transition' method can be a String, an Object, or an Array.
It will be normalized to an Array, so that:
```javascript
myHaa.transition('myclass')
```
is equivalent to:
```javascript
myHaa.transition({class: 'myclass'})
```
which is equivalent to:
```javascript
myHaa.transition([{{class: ''}}, {class: 'myclass'}]);
```  
Each object in the array represents a step of the transition. If only one String or Object is passed, it is assumed that the first step is the current step.  
The objects of the Array have the following format:
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
myHaa.transition('myclass').then(function(){
	var myElement = document.querySelector('#myid');
	myElement.classList.add('finalStateClass');
	myElement.innerHtml = '<div>finalStateContent</div>';
})
```

**'setDimensionsClass'**
```javascript
myHaa.setDimensionsClass('maximalClass');
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
