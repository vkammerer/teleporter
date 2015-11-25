!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var i in n)("object"==typeof exports?exports:e)[i]=n[i]}}(this,function(){return function(e){function t(i){if(n[i])return n[i].exports;var s=n[i]={exports:{},id:i,loaded:!1};return e[i].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var n={};return t.m=e,t.c=n,t.p="/dist/",t(0)}([function(e,t,n){e.exports=n(2)},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){var t=void 0,n={animation:{duration:800,easing:"linear"}};if("string"==typeof e)t=Object.assign({},n,{selector:e});else if("object"==typeof e&&"string"==typeof e.selector){var i={selector:e.selector};if("string"==typeof e.sizeClass&&(i.sizeClass=e.sizeClass),"object"==typeof e.animation){var s={};"number"==typeof e.animation.duration&&(s.duration=e.animation.duration),"string"==typeof e.animation.easing&&(s.easing=e.animation.easing),Object.keys(s).length>0&&(i.animation=s)}t=Object.assign({},n,i)}return t};t.constructorArgument=n;var i=function(e){var t=void 0;if("string"==typeof e)t=[{"class":""},{"class":e}];else if("object"==typeof e)if("string"==typeof e["class"])t=[{"class":""},e];else if(Array.isArray(e)){t=[],1===e.length&&t.push({"class":""});for(var n=0;n<e.length;n++)if("string"==typeof e[n])t.push({"class":e[n]});else{if("object"!=typeof e[n]||"string"!=typeof e[n]["class"]){t=void 0;break}t.push(e[n])}}return t};t.teleportArgument=i},function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function s(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=n(1),l=n(3),c=i(l),Teleporter=function(){function Teleporter(e){r(this,Teleporter);var t=(0,a.constructorArgument)(e);return t?(Object.assign(this,t),this.element=document.querySelector(this.selector),this.element?(this.innerHTML=this.element.innerHTML,this.setSizeClass(this.sizeClass),void this.element.classList.add("teleporter-idle")):void console.error("Teleporter.js: No element found with the selector '"+this.selector+"'")):void console.error("Teleporter.js: No valid argument passed to the constructor 'Teleporter'")}return o(Teleporter,[{key:"setInnerElement",value:function(){this.innerElement=document.createElement("div"),this.innerElement.innerHTML=this.innerHTML,this.element.innerHTML="",this.element.insertBefore(this.innerElement,null),Object.assign(this.element.style,{background:"transparent"}),Object.assign(this.innerElement.style,{background:this.style.background})}},{key:"resetElement",value:function(){this.teleportation&&this.teleportation.player&&this.teleportation.player.cancel(),this.element.innerHTML=this.innerHTML,Object.assign(this.element.style,{width:null,height:null,padding:null,background:null})}},{key:"getRect",value:function(e){var t=void 0;return"string"==typeof e&&e.length>0?(this.element.classList.add(e),t=this.element.getBoundingClientRect(),this.element.classList.remove(e)):t=this.element.getBoundingClientRect(),t}},{key:"getStyles",value:function(e){var t=void 0;return"string"==typeof e&&e.length>0?(this.element.classList.add(e),t=Object.assign({},window.getComputedStyle(this.element)),this.element.classList.remove(e)):t=Object.assign({},window.getComputedStyle(this.element)),t}},{key:"setInnerStyles",value:function(e,t){Object.assign(this.innerElement.style,{width:t.width+"px",height:t.height+"px"});var n=this.innerElement.getBoundingClientRect();Object.assign(this.innerElement.style,{transform:(0,c["default"])(e,n)})}},{key:"setSizeClass",value:function(e){this.sizeClass=e,this.resetElement(),this.sizeRect=this.getRect(this.sizeClass),this.style=this.getStyles(this.sizeClass),this.setInnerElement(),this.setInnerStyles(this.getRect(),this.sizeRect)}},{key:"setTeleportationStepsRects",value:function(){var e=this;this.teleportation.steps.forEach(function(t){t.rect=e.getRect(t["class"])})}},{key:"setTeleportationRect",value:function(){var e=void 0,t=void 0;if(!this.sizeRect){var n=this.teleportation.steps.map(function(e){return e.rect.width}),i=this.teleportation.steps.map(function(e){return e.rect.height});this.teleportation.sizeRect={},e=Math.max.apply(Math,s(n)),t=Math.max.apply(Math,s(i))}Object.assign(this.innerElement.style,{width:(this.sizeRect.width||e)+"px",height:(this.sizeRect.height||e)+"px"}),this.teleportation.sizeRect=this.innerElement.getBoundingClientRect()}},{key:"animate",value:function(e){var t=this,n=Object.assign({},this.animation,this.teleportation.steps[e+1].animation);this.innerElement.style.transform=(0,c["default"])(this.teleportation.steps[e+1].rect,this.teleportation.sizeRect),this.teleportation.player=this.innerElement.animate([{transform:(0,c["default"])(this.teleportation.steps[e].rect,this.teleportation.sizeRect)},{transform:(0,c["default"])(this.teleportation.steps[e+1].rect,this.teleportation.sizeRect)}],{duration:n.duration,easing:n.easing}),this.teleportation.player.addEventListener("finish",function(){t.teleportation.player.removeEventListener("finish"),e<t.teleportation.steps.length-2?t.animate(e+1):(t.teleportation.resolve(),t.element.classList.remove("teleporter-active"),t.element.classList.add("teleporter-idle"))})}},{key:"teleport",value:function(e){var t=this,n=(0,a.teleportArgument)(e);return n?(this.resetElement(),this.teleportation={steps:n},this.setTeleportationStepsRects(),this.setInnerElement(),this.setTeleportationRect(),this.element.classList.remove("teleporter-idle"),this.element.classList.add("teleporter-active"),this.setInnerStyles(this.teleportation.steps[0].rect,this.teleportation.sizeRect),this.animate(0),new Promise(function(e,n){Object.assign(t.teleportation,{resolve:e,reject:n})})):void console.error("Teleporter.js: No valid argument passed to method 'teleport'")}}]),Teleporter}();t["default"]=Teleporter,e.exports=t["default"]},function(e,t){"use strict";function n(e,t){var n=e.width/t.width,i=e.height/t.height,s=e.left-t.left+(e.width-t.width)/2,r=e.top-t.top+(e.height-t.height)/2;return"\n		translateX("+s+"px)\n		translateY("+r+"px)\n		scaleX("+n+")\n		scaleY("+i+")\n	"}Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n,e.exports=t["default"]}])});