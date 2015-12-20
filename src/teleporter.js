/**
* Provides the base Teleporter class
*
* @module Teleporter
*/
import {
	debounce
} from './debounce';

import {
	constructorArgument,
	createTeleportationArgument
} from './arguments';

import {
	normalizeRect,
	getTransform
} from './geometry';

import {
	setElementSize,
	resetElementSize,
	setWrapper,
	resetWrapper,
	setWrapperSize
} from './dom-utils';

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
	constructor(arg) {
		Object.assign(this, constructorArgument(arg));
		this.element = document.querySelector(this.selector);
		if (!this.element) {
			console.error(`Teleporter.js: No element found with the selector '${this.selector}'`);
			return;
		};
		this.element.classList.add('teleporter-idle');
		this.setSizeClass(this.sizeClass);
		window.addEventListener('resize', debounce(this.setSizeClass.bind(this, this.sizeClass), 100));
	}

	/**
	* Gets size and position of the element when applied a certain class.
	*
	* @method getRect
	* @param {String} className The name of the class to apply
	* to the element. Optional.
	* @param {String} ratioSide The side that should have its length updated
	* to keep the node proportional to that of sizeRect. Optional.
	* @return {Object} Returns a 'rect' object as returned by Element.getBoundingClientRect()
	* (https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
	*/
	getElementRect(className, ratioSide) {
		let rect;
		let applyClass = (
			(typeof className === 'string') &&
			(className.length > 0)
		)
		let applyRatio = (
			(this.sizeClass && this.sizeRect && ratioSide) &&
			(className !== this.sizeClass)
		)
		if (applyClass) { this.element.classList.add(className); }
		if (applyRatio) { setElementSize(this.element, this.sizeRect, ratioSide); }
		rect = normalizeRect(this.element);
		if (applyRatio) { resetElementSize(this.element); }
		if (applyClass) { this.element.classList.remove(className); }
		return rect;
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
		resetWrapper(this.element);
		resetElementSize(this.element);
		this.sizeClass = className;
		this.sizeRect = this.getElementRect(this.sizeClass);
		this.elementRect = this.getElementRect(null, this.ratioSide);
		setElementSize(this.element, this.sizeRect, this.ratioSide);
		this.wrapper = setWrapper(this.element);
		setWrapperSize(this.wrapper, this.elementRect, this.sizeRect);
		this.initTime = Date.now();
	}

	/**
	* Measure the size of the original rasterized node for the teleportation:
	* - if 'this.sizeClass' is defined, use its size.
	* - otherwise, create a node with the maximal width
	* and height of all steps of the teleportation.
	*
	* @method getTeleportationSize
	*/
	getTeleportationSize(steps) {
		if (this.sizeClass) {
			return {
				width: this.sizeRect.width,
				height: this.sizeRect.height
			}
		}
		else {
			let widths = steps.map((obj) => {
				return obj.rect.width
			})
			let heights = steps.map((obj) => {
				return obj.rect.height
			})
			return {
				width: Math.max(...widths),
				height: Math.max(...heights)
			}
		}
	}

	/**
	* Handle the "finish" event of the animation player of the running teleportation
	*
	* @method handleEvent
	*/
	handleEvent() {
		this.runningTeleportation.player.removeEventListener('finish', this, false);
		if (this.runningTeleportation.stepIndex < this.runningTeleportation.steps.length - 1) {
			this.runningTeleportation.stepIndex++;
			this.animate();
		}
		else {
			let finalStep = this.runningTeleportation.steps[this.runningTeleportation.stepIndex];
			Object.assign(this.wrapper.style, finalStep.webAnimation.stepStyles[1]);
			this.element.classList.remove('teleporter-active');
			this.element.classList.add('teleporter-idle');
			this.runningTeleportation.resolve();
		}
	}

	/**
	* Animate the element from one step to the next until the teleportation end.
	*
	* @method animate
	*/
	animate() {
		let step = this.runningTeleportation.steps[this.runningTeleportation.stepIndex];
		this.runningTeleportation.player = this.wrapper.animate(step.webAnimation.stepStyles, {
		  duration: step.webAnimation.animation.duration,
		  delay: step.webAnimation.animation.delay,
		  easing: step.webAnimation.animation.easing
		});
		this.runningTeleportation.player.addEventListener('finish', this, false);
	}

	/**
	* Get the rect of the rasterized node to use for the teleportation
	*
	* @method animate
	*/
	getTeleportationSizeRect(size) {
		this.wrapper = setWrapper(this.element);
		Object.assign(this.wrapper.style, {
			width: `${size.width}px`,
			height: `${size.height}px`
		});
		let sizeRect = normalizeRect(this.wrapper);
		setWrapperSize(this.wrapper, this.elementRect, this.sizeRect);
		return sizeRect;
	}

	/**
	* Measure transform properties to apply for each step
	* of the transition
	*
	* @method getTeleportationSteps
	*/
	getTeleportationSteps(steps, sizeRect) {
		for (let index = 1; index < steps.length; index++) {
			let previousStep = steps[index - 1];
			let step = steps[index];
			step.webAnimation = {
				animation: Object.assign({}, this.animation, step.animation),
				stepStyles: [
				  { transform: getTransform(previousStep.rect, sizeRect) },
				  { transform: getTransform(step.rect, sizeRect) }
				]
			}
			if (previousStep.rotate && step.rotate) {
				step.webAnimation.stepStyles[0].transform += ` rotate(${previousStep.rotate})`;
				step.webAnimation.stepStyles[1].transform += ` rotate(${step.rotate})`;
			}
			if (
				(typeof previousStep.opacity === 'number') &&
				(typeof step.opacity === 'number')
			) {
				step.webAnimation.stepStyles[0].opacity = previousStep.opacity;
				step.webAnimation.stepStyles[1].opacity = step.opacity;
			}
		}
		return steps;
	}

	/**
	* Get a teleportable object
	*
	* @method createTeleportation
	*/
	createTeleportation(arg) {
		let steps = createTeleportationArgument(arg);
		resetWrapper(this.element);
		resetElementSize(this.element);
		steps.forEach((step) => {
			let ratioSide = (typeof step.ratioSide !== 'undefined') ? step.ratioSide : this.ratioSide;
			Object.assign(step, { rect: this.getElementRect(step.class, ratioSide) })
		});
		setElementSize(this.element, this.sizeRect, this.ratioSide);
		let teleportation = {};
		let size = this.getTeleportationSize(steps);
		teleportation.sizeRect = this.getTeleportationSizeRect(size);
		teleportation.steps = this.getTeleportationSteps(steps, teleportation.sizeRect);
		teleportation.run = run.bind(this, teleportation);
		teleportation.initTime = this.initTime;
		return teleportation;
	}

	teleport(arg) {
		return this.createTeleportation(arg).run();
	}

}

function run(teleportation) {

	if (this.runningTeleportation && this.runningTeleportation.player) {
		this.runningTeleportation.player.cancel();
	}

	if (teleportation.initTime !== this.initTime) {
		Object.assign(teleportation, this.createTeleportation(teleportation.steps))
	}

	this.runningTeleportation = teleportation;
	this.runningTeleportation.stepIndex = 1;

	// Set styles and launch animation
	this.element.classList.remove('teleporter-idle');
	this.element.classList.add('teleporter-active');
	setWrapperSize(this.wrapper, this.runningTeleportation.steps[0].rect, this.runningTeleportation.sizeRect);
	this.animate();

	// Return a promise that will resolve on teleportation end
	return new Promise((resolve, reject) => {
		Object.assign(this.runningTeleportation, {
			resolve: resolve,
			reject: reject
		});
	});
}
