/**
* Provides the base Teleporter class
*
* @module Teleporter
*/

import {
	constructorArgument,
	teleportArgument
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
		let options = constructorArgument(arg)
		if (!options) {
			console.error(`Teleporter.js: No valid argument passed to the constructor 'Teleporter'`);
			return;
		}
		Object.assign(this, options);
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
	getTeleportationSize(teleportation) {
		if (this.sizeClass) {
			return {
				width: this.sizeRect.width,
				height: this.sizeRect.height
			}
		}
		else {
			let widths = teleportation.steps.map((obj) => {
				return obj.rect.width
			})
			let heights = teleportation.steps.map((obj) => {
				return obj.rect.height
			})
			return {
				width: Math.max(...widths),
				height: Math.max(...heights)
			}
		}
	}

	handleEvent = () => {
		this.teleportation.player.removeEventListener('finish', this, false);
		if (this.teleportation.stepIndex < this.teleportation.steps.length - 1) {
			this.teleportation.stepIndex++;
			this.animate();
		}
		else {
			let finalStepStyle = this.teleportation.steps[this.teleportation.stepIndex].webAnimation.stepStyles[1];
			Object.assign(this.wrapper.style, finalStepStyle);
			this.element.classList.remove('teleporter-active');
			this.element.classList.add('teleporter-idle');
			this.teleportation.resolve();
		}
	}

	/**
	* Animate the element from one step to the next until the teleportation end.
	*
	* @method animate
	*/
	animate() {
		let step = this.teleportation.steps[this.teleportation.stepIndex];
		if (this.teleportation.stepIndex === 1) {
			setWrapperStyles(this.wrapper, this.teleportation.steps[0].rect, this.teleportation.sizeRect);
		}
		this.teleportation.player = this.wrapper.animate(step.webAnimation.stepStyles, {
		  duration: step.webAnimation.animation.duration,
		  delay: step.webAnimation.animation.delay,
		  easing: step.webAnimation.animation.easing
		});
		this.teleportation.player.addEventListener('finish', this, false);
	}

	setTeleportationWrapper(teleportation) {
		this.wrapper = setWrapper(this.element);
		Object.assign(this.wrapper.style, {
			width: `${teleportation.size.width}px`,
			height: `${teleportation.size.height}px`
		});
		teleportation.sizeRect = getRect(this.wrapper);
		setWrapperStyles(this.wrapper, this.elementRect, this.sizeRect);
	}

	setTeleportationStepsStyles(teleportation) {
		for (let index = 1; index < teleportation.steps.length; index++) {
			let previousStep = teleportation.steps[index - 1];
			let step = teleportation.steps[index];
			step.webAnimation = {
				animation: Object.assign({}, this.animation, step.animation),
				stepStyles: [
				  { transform: getTransform(previousStep.rect, teleportation.sizeRect) },
				  { transform: getTransform(step.rect, teleportation.sizeRect) }
				]
			}
			if (
				(typeof previousStep.opacity === 'number') &&
				(typeof step.opacity === 'number')
			) {
				step.webAnimation.stepStyles[0].opacity = previousStep.opacity;
				step.webAnimation.stepStyles[1].opacity = step.opacity;
			}
		}
	}

	createTeleportation(arg) {

		let steps = teleportArgument(arg);
		if (!steps) {
			console.error(`Teleporter.js: No valid argument passed to method 'createTeleportation'`);
			return;
		}

		resetElement(this.element);

		let teleportation = {};
		teleportation.steps = steps.map((step) => {
			return Object.assign(step, { rect: getRect(this.element, step.class) })
		});
		teleportation.size = this.getTeleportationSize(teleportation);
		teleportation.run = run.bind(this, teleportation);

		this.setTeleportationWrapper(teleportation);
		this.setTeleportationStepsStyles(teleportation);

		return teleportation;
	}

	teleport(arg) {
		return this.createTeleportation(arg).run();
	}

}

function run(teleportation){

	if (this.teleportation && this.teleportation.player) {
		this.teleportation.player.cancel();
	}

	this.teleportation = teleportation;
	this.teleportation.stepIndex = 1;

	// Set styles and launch animation
	this.element.classList.remove('teleporter-idle');
	this.element.classList.add('teleporter-active');
	requestAnimationFrame(this.animate.bind(this));

	// Return a promise that will resolve on teleportation end
	return new Promise((resolve, reject) => {
		Object.assign(this.teleportation, {
			resolve: resolve,
			reject: reject
		});
	});
}
