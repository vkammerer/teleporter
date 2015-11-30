/**
* Provides the base Teleporter class
*
* @module Teleporter
*/

import { constructorArgument, teleportArgument } from './arguments';
import { transforms, normalizeRect } from './geometry';
import { normalizeGetComputedStyle, normalizeApplyBackground } from './utils';

/**
* Main class
*
* @class Teleporter
* @constructor:
* - Normalizes arguments
* - Sets this.element
* - Sets this.sizeClass
*/
export default class Teleporter {
	constructor(options) {
		let formattedArg = constructorArgument(options)
		if (!formattedArg) {
			console.error(`Teleporter.js: No valid argument passed to the constructor 'Teleporter'`);
			return;
		}
		Object.assign(this, formattedArg);
		this.element = document.querySelector(this.selector);
		if (!this.element) {
			console.error(`Teleporter.js: No element found with the selector '${this.selector}'`);
			return;
		};
		this.element.classList.add('teleporter-element','teleporter-idle');
		this.setSizeClass(this.sizeClass);
	}
	setInnerElement(){
		this.innerElement = document.createElement('div');
		this.innerElement.className = 'teleporter-container';
		while (this.element.childNodes.length > 0) {
			this.innerElement.appendChild(this.element.childNodes[0]);
		}
		this.element.insertBefore(this.innerElement, null);
		Object.assign(this.element.style, {
			background: 'transparent'
		});
		normalizeApplyBackground(this.innerElement, this.style);
	}
	resetElement(){
		if (this.teleportation && this.teleportation.player) {
			this.teleportation.player.cancel();
		}
		if (this.innerElement) {
			while (this.innerElement.childNodes.length > 0) {
				this.element.appendChild(this.innerElement.childNodes[0]);
			}			
			this.element.removeChild(this.innerElement);			
		}
		Object.assign(this.element.style, {
			width: null,
			height: null,
			background: null
		});
	}
	/**
	* Gets size and position of the element when applied a certain class.
	*
	* @method getRect
	* @param {String} className The name of the class to apply
	* to the element. Not required.
	* @return {Object} Returns a 'rect' object as returned by Element.getBoundingClientRect()
	* (https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
	*/
	getRect(className) {
		let rect;
		if (
			(typeof className === 'string') &&
			(className.length > 0)
		) {
			this.element.classList.add(className);
			rect = normalizeRect(this.element);
			this.element.classList.remove(className);
		}
		else {
			rect = normalizeRect(this.element);
		}
		return rect;
	}

	getStyles(className) {
		let style;
		if (
			(typeof className === 'string') &&
			(className.length > 0)
		) {
			this.element.classList.add(className);
			style = normalizeGetComputedStyle(this.element)
			this.element.classList.remove(className);
		}
		else {
			style = normalizeGetComputedStyle(this.element)
		}
		return style;
	}

	/**
	* Applies inline style attributes to modify the element
	* from the state of the original rasterized node to the current state. 
	*
	* @method setInnerStyles
	* @param {Object} rect Contains the size and position
	* of the element as it should be displayed on the page.
	* @param {Object} sizeRect Contains the size of the element
	* that should be used to create the original rasterized node.
	*/
	setInnerStyles(rect, sizeRect) {

		Object.assign(this.innerElement.style, {
			width: `${sizeRect.width}px`,
			height: `${sizeRect.height}px`
		});

		let innerElementRect = this.innerElement.getBoundingClientRect();

		Object.assign(this.innerElement.style, {
			transform: transforms(rect, innerElementRect)
		});

	}

	/**
	* Public API Method.
	* Sets the class to be used for the original rasterized node,
	* and applies the styles modification for the current state. 
	*
	* @method set
	* @param {String} className Name of the class to apply. Optional.
	*/
	setSizeClass(className) {
		this.sizeClass = className;
		this.resetElement();
		let currentRect = this.getRect();
		this.sizeRect = this.getRect(this.sizeClass);
		this.style = this.getStyles(this.sizeClass);
		this.setInnerElement();
		this.setInnerStyles(currentRect, this.sizeRect)
	}

	/**
	* Measures the size and position for all steps of the teleportation. 
	*
	* @method setTeleportationStepsRects
	*/
	setTeleportationStepsRects() {
		this.teleportation.steps.forEach((obj) => {
			obj.rect = this.getRect(obj.class)
		})
	}

	/**
	* Measures the size of the original rasterized node for the teleportation:
	* - if 'this.sizeClass' is defined, use its size. 
	* - otherwise, create a node with the maximal width
	* and height of all steps of the teleportation. 
	*
	* @method setTeleportationRect
	*/
	setTeleportationRect() {
		let width, height;
		if (!this.sizeClass) {
			let widthArr = this.teleportation.steps.map((obj) => {
				return obj.rect.width
			})
			let heightArr = this.teleportation.steps.map((obj) => {
				return obj.rect.height
			})
			width = Math.max(...widthArr);
			height = Math.max(...heightArr);
		}

		Object.assign(this.innerElement.style, {
			width: `${width || this.sizeRect.width}px`,
			height: `${height || this.sizeRect.height}px`
		});

		this.teleportation.sizeRect = normalizeRect(this.innerElement);

	}

	/**
	* Animates the element from one step to the next until the teleportation end.
	*
	* @method animate
	* @param {Integer} index Index of the step from which to apply the animation.
	*/
	animate(index) {
		let animation = Object.assign({}, this.animation, this.teleportation.steps[index + 1].animation);
		if (index == this.teleportation.steps.length - 2) {
			this.innerElement.style.transform = transforms(this.teleportation.steps[index + 1].rect, this.teleportation.sizeRect);
		}
		this.teleportation.player = this.innerElement.animate([
		  { transform: transforms(this.teleportation.steps[index].rect, this.teleportation.sizeRect) },
		  { transform: transforms(this.teleportation.steps[index + 1].rect, this.teleportation.sizeRect) }
		], {
		  duration: animation.duration,
		  easing: animation.easing
		});
		this.teleportation.player.addEventListener('finish', () => {
			this.teleportation.player.removeEventListener('finish');
			if (index < this.teleportation.steps.length - 2) {
				this.animate(index + 1);
			}
			else {
				this.element.classList.remove('teleporter-active');
				this.element.classList.add('teleporter-idle');
				this.teleportation.resolve();
			}
		});
	}

	/**
	* Public API method.
	* Initiates teleportation between each state.
	*
	* @method teleport
	* @param {String|Object|Array} arg Steps of the teleportation to perform.
	* Can be of various types (see 'teleportArgument' method in './arguments').
	*/
	teleport(arg) {
		// Checks arguments format
		let formattedArg = teleportArgument(arg);
		if (!formattedArg) {
			console.error(`Teleporter.js: No valid argument passed to method 'teleport'`);
			return;
		}

		this.resetElement();

		// Builds the teleportation attribute
		this.teleportation = { steps: formattedArg };
		this.setTeleportationStepsRects();
		this.setInnerElement();
		this.setTeleportationRect();

		// Sets styles and launch animation
		this.element.classList.remove('teleporter-idle');
		this.element.classList.add('teleporter-active');
		this.setInnerStyles(this.teleportation.steps[0].rect, this.teleportation.sizeRect);
		this.animate(0);

		// Returns a promise that will resolve on teleportation end
		return new Promise((resolve, reject) => {
			Object.assign(this.teleportation, {
				resolve: resolve,
				reject: reject
			});
		});
	}

}
