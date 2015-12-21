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
The good news is that most mobile browsers are chromium based, and that [Chrome now represent over 50% of browser usage](http://gs.statcounter.com/#browser-ww-monthly-201411-201511) worldwide.
