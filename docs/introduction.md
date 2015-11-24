Hardware Accelerated Animations with boring CSS properties.  

## What?
Teleporter is a small utility that makes it possible to animate elements with 'transform', while defining their size and position with usual CSS properties (properties that trigger the 'Layout' or 'Paint' phases of the [browser rendering pipeline](http://www.html5rocks.com/en/tutorials/internals/howbrowserswork/) as explained on [csstriggers.com](http://csstriggers.com/)).

| Usual CSS properties | 'transform' CSS property |
| :------------- | :------------- |
| example: {left: 200px} | example: {transform:'translateX(200px)'} |
| Easy to use for layout. | Hard to use for layout |
| Janky animations | Smooth animations |

Original inspiration comes from the hack explained by Paul Lewis: [FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/).

## Example
[Codepen demo](http://codepen.io/vkammerer/pen/ZbPdmN)
