/**
* Provides the base Teleporter class
*
* @module Teleporter
*/

import {
	constructorArgument,
	createTeleportationArgument
} from './arguments';

import {
	getRect,
	getTransform
} from './geometry';

import {
	setWrapper,
	setWrapperStyles,
	resetElement
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
		resetElement(this.element);
		this.elementRect = getRect(this.element);
		this.sizeClass = className;
		this.sizeRect = getRect(this.element, this.sizeClass);
		this.wrapper = setWrapper(this.element);
		setWrapperStyles(this.wrapper, this.elementRect, this.sizeRect);
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
		if (this.runningTeleportation.stepIndex === 1) {
			setWrapperStyles(this.wrapper, this.runningTeleportation.steps[0].rect, this.runningTeleportation.sizeRect);
		}
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
		let sizeRect = getRect(this.wrapper);
		setWrapperStyles(this.wrapper, this.elementRect, this.sizeRect);
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
		resetElement(this.element);
		steps.forEach((step) => {
			Object.assign(step, { rect: getRect(this.element, step.class) })
		});
		let teleportation = {};
		let size = this.getTeleportationSize(steps);
		teleportation.sizeRect = this.getTeleportationSizeRect(size);
		teleportation.steps = this.getTeleportationSteps(steps, teleportation.sizeRect);
		teleportation.run = run.bind(this, teleportation);
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

	this.runningTeleportation = teleportation;
	this.runningTeleportation.stepIndex = 1;

	// Set styles and launch animation
	this.element.classList.remove('teleporter-idle');
	this.element.classList.add('teleporter-active');
	requestAnimationFrame(this.animate.bind(this));

	// Return a promise that will resolve on teleportation end
	return new Promise((resolve, reject) => {
		Object.assign(this.runningTeleportation, {
			resolve: resolve,
			reject: reject
		});
	});
}
