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
	el.classList.add('finalStateClass');
})
```

**'setDimensionsClass'**  
```javascript
myElement.setDimensionsClass('maximalClass');
```
Sets the 'dimensionsClass' attribute (see 'Constructor options' > 'dimensionsClass' above) and applies transformation to the element.