/**
* Provides the base Flipper class
*
* @module Flipper
*/

import { constructorArgument, transitionArgument } from './arguments';
import transforms from './transforms';

/**
* Main class
*
* @class Flipper
* @constructor:
* - Normalizes arguments
* - Sets this.element
* - Sets this.dimensionsClass
*/
export default class Flipper {
	constructor(options) {
		let formattedArg = constructorArgument(options)
		if (formattedArg) {
			Object.assign(this, formattedArg);
		}
		else {
			console.error(`Flipper.js: No valid argument passed to the constructor 'Flipper'`);
			return;
		};
		this.element = document.querySelector(this.selector);
		if (!this.element) {
			console.error(`Flipper.js: No element found with the selector '${this.selector}'`);
			return;
		};
		if (this.dimensionsClass) {
			this.setModificationStyles(this.getRect(), this.getRect(this.dimensionsClass))
		}
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
			rect = this.element.getBoundingClientRect();
			this.element.classList.remove(className);
		}
		else {
			rect = this.element.getBoundingClientRect();
		}
		return rect;
	}

	/**
	* Applies inline style attributes to modify the element
	* from the state of the original rasterized node to the current state. 
	*
	* @method setModificationStyles
	* @param {Object} rect Contains the size and position
	* of the element as it should be displayed on the page.
	* @param {Object} dimensionsRect Contains the size of the element
	* that should be used to create the original rasterized node.
	*/
	setModificationStyles(rect, dimensionsRect) {
		Object.assign(this.element.style, {
			width: `${dimensionsRect.width}px`,
			height: `${dimensionsRect.height}px`
		})
		let afterDimensionsRect = this.element.getBoundingClientRect();
		Object.assign(this.element.style, {
			marginLeft: `${rect.left - afterDimensionsRect.left}px`,
			marginRight: `${rect.right - afterDimensionsRect.right}px`,
			marginTop: `${rect.top - afterDimensionsRect.top}px`,
			marginBottom: `${rect.bottom - afterDimensionsRect.bottom}px`
		})
		let afterDimensionsAndMarginsRect = this.element.getBoundingClientRect();
		Object.assign(this.element.style, {
			transform: transforms(rect, afterDimensionsAndMarginsRect)
		})
	}

	/**
	* Removes inline style attributes potentially set previously. 
	*
	* @method resetModificationStyles
	*/
	resetModificationStyles() {
		Object.assign(this.element.style, {
			width: null,
			height: null,
			transform: null,
			marginLeft: null,
			marginRight: null,
			marginTop: null,
			marginBottom: null
		})			
	}

	/**
	* Public API Method.
	* Sets the class to be used for the original rasterized node,
	* and applies the styles modification for the current state. 
	*
	* @method setDimensionsClass
	* @param {String} className Name of the class to apply. Required.
	*/
	setDimensionsClass(className) {
		if (typeof className !== 'string') {
			console.error(`Flipper.js: No valid argument passed to method 'setDimensionClass'`);
			return;
		}
		this.dimensionsClass = className;
		this.resetModificationStyles();
		this.setModificationStyles(this.getRect(), this.getRect(this.dimensionsClass))
	}

	/**
	* Measures the size and position for all steps of the transition. 
	*
	* @method setTransitStepsRects
	*/
	setTransitStepsRects() {
		this.transit.steps.forEach((obj) => {
			obj.rect = this.getRect(obj.class)
		})
	}

	/**
	* Measures the size of the original rasterized node for the transition:
	* - if 'this.dimensionsClass' is defined, use its size. 
	* - otherwise, create a node with the maximal width
	* and height of all steps of the transition. 
	*
	* @method setTransitDimensionsRect
	*/
	setTransitDimensionsRect() {
		let width, height;
		if (this.dimensionsClass) {
			let dimensionsRect = this.getRect(this.dimensionsClass)
			width = dimensionsRect.width;
			height = dimensionsRect.height;
		}
		else {
			let widthArr = this.transit.steps.map((obj) => {
				return obj.rect.width
			})
			let heightArr = this.transit.steps.map((obj) => {
				return obj.rect.height
			})
			width = Math.max(...widthArr);
			height = Math.max(...heightArr);
		}
		this.transit.dimensionsRect = {
			left: this.transit.steps[0].rect.left,
			top: this.transit.steps[0].rect.top,
			width: width,
			height: height
		};
	}

	/**
	* Animates the element from one step to the next until the transition end.
	*
	* @method animate
	* @param {Integer} index Index of the step from which to apply the animation.
	*/
	animate(index) {
		let animation = Object.assign({}, this.animation, this.transit.steps[index + 1].animation);
		this.element.style.transform = transforms(this.transit.steps[index + 1].rect, this.transit.dimensionsRect);
		this.transit.player = this.element.animate([
		  { transform: transforms(this.transit.steps[index].rect, this.transit.dimensionsRect) },
		  { transform: transforms(this.transit.steps[index + 1].rect, this.transit.dimensionsRect) }
		], {
		  duration: animation.duration,
		  easing: animation.easing
		});
		this.transit.player.addEventListener('finish', () => {
			this.transit.player.removeEventListener('finish');
			if (index < this.transit.steps.length - 2) {
				this.animate(index + 1);
			}
			else {
				this.transit.resolve();
			}
		});
	}

	/**
	* Public API method.
	* Initiates transition between each states.
	*
	* @method transition
	* @param {String|Object|Array} arg Steps of the transition to perform.
	* Can be of various types (see 'transitionArgument' method in './arguments').
	*/
	transition(arg) {
		// Checks arguments format
		let formattedArg = transitionArgument(arg);
		if (!formattedArg) {
			console.error(`Flipper.js: No valid argument passed to method 'transition'`);
			return;
		}

		// Cleans up potential ongoing transition
		if (this.transit && this.transit.player) {
			this.transit.player.cancel();
		}
		this.resetModificationStyles();


		// Builds the transit attribute for the upcoming transition
		this.transit = { steps: formattedArg };
		this.setTransitStepsRects();
		this.setTransitDimensionsRect();

		// Sets styles and launch animation
		this.setModificationStyles(this.transit.steps[0].rect, this.transit.dimensionsRect);
		this.animate(0);

		// Returns a promise that will resolve on transition end
		return new Promise((resolve, reject) => {
			Object.assign(this.transit, {
				resolve: resolve,
				reject: reject
			});
		});
	}

}
