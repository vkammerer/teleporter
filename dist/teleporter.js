!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i=t();for(var n in i)("object"==typeof exports?exports:e)[n]=i[n]}}(this,function(){return function(e){function t(n){if(i[n])return i[n].exports;var r=i[n]={exports:{},id:n,loaded:!1};return e[n].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var i={};return t.m=e,t.c=i,t.p="/dist/",t(0)}([function(e,t,i){e.exports=i(5)},function(e,t){"use strict";function i(e){var t=e.getBoundingClientRect();return r({},{top:t.top+window.scrollY,left:t.left+window.scrollX,width:t.width,height:t.height})}function n(e,t){var i=e.width/t.width,n=e.height/t.height,r=Math.round(e.left-t.left+(e.width-t.width)/2),s=Math.round(e.top-t.top+(e.height-t.height)/2);return"\n		translateX("+r+"px)\n		translateY("+s+"px)\n		scaleX("+i+")\n		scaleY("+n+")\n	"}var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e};Object.defineProperty(t,"__esModule",{value:!0}),t.normalizeRect=i,t.getTransform=n},function(e,t){"use strict";function i(e){return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e}function n(e){var t={};return"number"==typeof e.animation.duration&&(t.duration=e.animation.duration),"number"==typeof e.animation.delay&&(t.delay=e.animation.delay),"string"==typeof e.animation.easing&&(t.easing=e.animation.easing),t}function r(e){if("string"!=typeof e["class"])return void console.error("Teleporter.js: No valid class passed to the teleportation step");var t={"class":e["class"]};return"number"==typeof e.opacity&&(t.opacity=e.opacity),"string"==typeof e.rotate&&(t.rotate=e.rotate),"undefined"!=typeof e.ratioSide&&(t.ratioSide=e.ratioSide),"object"===i(e.animation)&&(t.animation=n(e)),t}var s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e};Object.defineProperty(t,"__esModule",{value:!0});t.constructorArgument=function(e){var t={animation:{duration:800,delay:0,easing:"linear"}};if("string"==typeof e)return s({},t,{selector:e});if("object"===("undefined"==typeof e?"undefined":i(e))&&"string"==typeof e.selector){var r={selector:e.selector};return"string"==typeof e.sizeClass&&(r.sizeClass=e.sizeClass),"string"==typeof e.ratioSide&&(r.ratioSide=e.ratioSide),"object"===i(e.animation)&&(r.animation=n(e)),s({},t,r)}console.error("Teleporter.js: No valid argument passed to the constructor")},t.createTeleportationArgument=function(e){var t=void 0;if("string"==typeof e)t=[{"class":""},{"class":e}];else if("object"===("undefined"==typeof e?"undefined":i(e)))if(Array.isArray(e)){t=[],1===e.length&&t.push({"class":""});for(var n=0;n<e.length;n++)if("string"==typeof e[n])t.push({"class":e[n]});else{if("object"!==i(e[n])){t=void 0;break}t.push(r(e[n]))}}else t=[{"class":""},r(e)];return t?t:void console.error("Teleporter.js: No valid argument passed to method createTeleportation")}},function(e,t){"use strict";function i(e,t,i){var n;return function(){var r=this,s=arguments,o=function(){n=null,i||e.apply(r,s)},a=i&&!n;clearTimeout(n),n=setTimeout(o,t),a&&e.apply(r,s)}}Object.defineProperty(t,"__esModule",{value:!0}),t.debounce=i},function(e,t,i){"use strict";function n(e,t,i){var n=(0,p.normalizeRect)(e),r={width:n.width+"px",height:n.height+"px"};"height"===i?r.height=t.height*n.width/t.width+"px":"width"===i&&(r.width=t.width*n.height/t.height+"px"),l(e.style,r)}function r(e){l(e.style,{width:null,height:null})}function s(e){var t=document.createElement("div");for(t.className="teleporter-wrapper",t.style.willChange="transform";e.childNodes.length>0;)t.appendChild(e.childNodes[0]);return e.insertBefore(t,null),t}function o(e){var t=e.children[0];if(t&&t.classList.contains("teleporter-wrapper")){for(;t.childNodes.length>0;)e.appendChild(t.childNodes[0]);e.removeChild(t)}}function a(e,t,i){l(e.style,{width:i.width+"px",height:i.height+"px",transform:null});var n=e.getBoundingClientRect();l(e.style,{transform:(0,p.getTransform)(t,n)})}var l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e};Object.defineProperty(t,"__esModule",{value:!0}),t.setElementSize=n,t.resetElementSize=r,t.setWrapper=s,t.resetWrapper=o,t.setWrapperSize=a;var p=i(1)},function(e,t,i){"use strict";function n(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e){var t=this;return this.runningTeleportation&&this.runningTeleportation.player&&this.runningTeleportation.player.cancel(),e.initTime!==this.initTime&&o(e,this.createTeleportation(e.steps)),this.runningTeleportation=e,this.runningTeleportation.stepIndex=1,this.element.classList.remove("teleporter-idle"),this.element.classList.add("teleporter-active"),(0,c.setWrapperSize)(this.wrapper,this.runningTeleportation.steps[0].rect,this.runningTeleportation.sizeRect),this.animate(),new Promise(function(e,i){o(t.runningTeleportation,{resolve:e,reject:i})})}var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e},a=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}();Object.defineProperty(t,"__esModule",{value:!0});var l=i(3),p=i(2),h=i(1),c=i(4),u=function(){function e(t){return r(this,e),o(this,(0,p.constructorArgument)(t)),this.element=document.querySelector(this.selector),this.element?(this.element.classList.add("teleporter-idle"),this.setSizeClass(this.sizeClass),void window.addEventListener("resize",(0,l.debounce)(this.setSizeClass.bind(this,this.sizeClass),100))):void console.error("Teleporter.js: No element found with the selector '"+this.selector+"'")}return a(e,[{key:"getElementRect",value:function(e,t){var i=void 0,n="string"==typeof e&&e.length>0,r=this.sizeClass&&this.sizeRect&&t&&e!==this.sizeClass;return n&&this.element.classList.add(e),r&&(0,c.setElementSize)(this.element,this.sizeRect,t),i=(0,h.normalizeRect)(this.element),r&&(0,c.resetElementSize)(this.element),n&&this.element.classList.remove(e),i}},{key:"setSizeClass",value:function(e){(0,c.resetWrapper)(this.element),(0,c.resetElementSize)(this.element),this.sizeClass=e,this.sizeRect=this.getElementRect(this.sizeClass),this.elementRect=this.getElementRect(null,this.ratioSide),(0,c.setElementSize)(this.element,this.sizeRect,this.ratioSide),this.wrapper=(0,c.setWrapper)(this.element),(0,c.setWrapperSize)(this.wrapper,this.elementRect,this.sizeRect),this.initTime=Date.now()}},{key:"getTeleportationSize",value:function(e){if(this.sizeClass)return{width:this.sizeRect.width,height:this.sizeRect.height};var t,i,r=e.map(function(e){return e.rect.width}),s=e.map(function(e){return e.rect.height});return{width:(t=Math).max.apply(t,n(r)),height:(i=Math).max.apply(i,n(s))}}},{key:"handleEvent",value:function(){if(this.runningTeleportation.player.removeEventListener("finish",this,!1),this.runningTeleportation.stepIndex<this.runningTeleportation.steps.length-1)this.runningTeleportation.stepIndex++,this.animate();else{var e=this.runningTeleportation.steps[this.runningTeleportation.stepIndex];o(this.wrapper.style,e.webAnimation.stepStyles[1]),this.element.classList.remove("teleporter-active"),this.element.classList.add("teleporter-idle"),this.runningTeleportation.resolve()}}},{key:"animate",value:function(){var e=this.runningTeleportation.steps[this.runningTeleportation.stepIndex];this.runningTeleportation.player=this.wrapper.animate(e.webAnimation.stepStyles,{duration:e.webAnimation.animation.duration,delay:e.webAnimation.animation.delay,easing:e.webAnimation.animation.easing}),this.runningTeleportation.player.addEventListener("finish",this,!1)}},{key:"getTeleportationSizeRect",value:function(e){this.wrapper=(0,c.setWrapper)(this.element),o(this.wrapper.style,{width:e.width+"px",height:e.height+"px"});var t=(0,h.normalizeRect)(this.wrapper);return(0,c.setWrapperSize)(this.wrapper,this.elementRect,this.sizeRect),t}},{key:"getTeleportationSteps",value:function(e,t){for(var i=1;i<e.length;i++){var n=e[i-1],r=e[i];r.webAnimation={animation:o({},this.animation,r.animation),stepStyles:[{transform:(0,h.getTransform)(n.rect,t)},{transform:(0,h.getTransform)(r.rect,t)}]},n.rotate&&r.rotate&&(r.webAnimation.stepStyles[0].transform+=" rotate("+n.rotate+")",r.webAnimation.stepStyles[1].transform+=" rotate("+r.rotate+")"),"number"==typeof n.opacity&&"number"==typeof r.opacity&&(r.webAnimation.stepStyles[0].opacity=n.opacity,r.webAnimation.stepStyles[1].opacity=r.opacity)}return e}},{key:"createTeleportation",value:function(e){var t=this,i=(0,p.createTeleportationArgument)(e);(0,c.resetWrapper)(this.element),(0,c.resetElementSize)(this.element),i.forEach(function(e){var i="undefined"!=typeof e.ratioSide?e.ratioSide:t.ratioSide;o(e,{rect:t.getElementRect(e["class"],i)})}),(0,c.setElementSize)(this.element,this.sizeRect,this.ratioSide);var n={},r=this.getTeleportationSize(i);return n.sizeRect=this.getTeleportationSizeRect(r),n.steps=this.getTeleportationSteps(i,n.sizeRect),n.run=s.bind(this,n),n.initTime=this.initTime,n}},{key:"teleport",value:function(e){return this.createTeleportation(e).run()}}]),e}();t["default"]=u}])});