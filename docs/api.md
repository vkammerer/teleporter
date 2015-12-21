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
