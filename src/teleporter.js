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
	stepsArgument
} from './arguments';

import {
	normalizeRect,
	getTransform
} from './geometry';

import {
	setElementSize,
	resetElementSize,
	setWrapper,
	unsetWrapper,
	setWrapperSize
} from './dom-utils';

/**
* Main class
*
* @class Teleporter
* @constructor:
* - Normalize argument
* - Bootstrap
*/
export default class Teleporter {
	constructor(arg) {
		Object.assign(this, constructorArgument(arg));
		this.element = document.querySelector(this.selector);
		if (!this.element) {
			console.error(`Teleporter.js: No element found with the selector '${this.selector}'`);
			return;
		}
		this.store = {};
		this.element.classList.add('teleporter-idle');
		window.addEventListener('resize', debounce(this.update.bind(this), 100));
		this.update();
	}

	/**
	* Get size and position of the element when applied a certain class.
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
		const applyClass = (
			(typeof className === 'string') &&
			(className.length > 0)
		);
		const applyRatio = (
			(this.sizeClass && ratioSide) &&
			(this.sizeClass !== className)
		);
		if (applyClass) { this.element.classList.add(className); }
		if (applyRatio) { setElementSize(this.element, this.sizeRect, ratioSide); }
		rect = normalizeRect(this.element);
		if (applyRatio) { resetElementSize(this.element); }
		if (applyClass) { this.element.classList.remove(className); }
		return rect;
	}

	/**
	* Public API Method.
	* Set the class to be used for the original rasterized node,
	* and applies the styles modification for the current state.
	*
	* @method update
	*/
	update() {
		unsetWrapper(this.element);
		resetElementSize(this.element);
		this.sizeRect = this.getElementRect(this.sizeClass);
		this.elementRect = this.getElementRect(null, this.ratioSide);
		setElementSize(this.element, this.sizeRect, this.ratioSide);
		this.wrapper = setWrapper(this.element);
		this.wrapperRect = setWrapperSize(
			this.wrapper, this.elementRect, this.sizeRect, this.pixelRounding
		);
		this.updateStore();
	}

	/**
	* Update previously saved steps measures.
	*
	* @method updateStore
	*/
	updateStore() {
		const storeSteps = Object.keys(this.store).map((key) => {
			return JSON.parse(key);
		});
		this.store = {};
		this.saveSteps(storeSteps);
	}

	/**
	* Animate the element from one step to the next until the teleportation end.
	*
	* @method animate
	*/
	animate() {
		const step = this.runningTeleportation.steps[this.runningTeleportation.stepIndex];
		Object.assign(this.wrapper.style, step.webAnimation.stepStyles[1]);
		this.runningTeleportation.player = this.wrapper.animate(step.webAnimation.stepStyles, {
			duration: step.webAnimation.animation.duration,
			delay: step.webAnimation.animation.delay,
			easing: step.webAnimation.animation.easing
		});
		this.runningTeleportation.player.addEventListener(
			'finish', this.onAnimateEnd.bind(this), false
		);
	}

	/**
	* Handle the "finish" event of the animation player of the running teleportation
	*
	* @method onAnimateEnd
	*/
	onAnimateEnd() {
		this.runningTeleportation.player.removeEventListener(
			'finish', this.onAnimateEnd.bind(this), false
		);
		if (this.runningTeleportation.stepIndex < this.runningTeleportation.steps.length - 1) {
			this.runningTeleportation.stepIndex++;
			this.animate();
		}
		else {
			this.element.classList.remove('teleporter-active');
			this.element.classList.add('teleporter-idle');
			this.runningTeleportation.resolve();
		}
	}

	/**
	* Save measure of each step in the store.
	*
	* @method saveSteps
	*/
	saveSteps(arg) {
		const steps = stepsArgument(arg);
		const superSteps = steps.map((step) => {
			return { key: JSON.stringify(step), step };
		});
		const unknownSteps = superSteps.filter((superStep) => {
			return (typeof this.store[superStep.key] === 'undefined');
		});
		if (unknownSteps.length === 0) {
			return superSteps.map((superStep) => {
				return this.store[superStep.key];
			});
		}
		unsetWrapper(this.element);
		resetElementSize(this.element);
		unknownSteps.forEach((superStep) => {
			const ratioSide = (typeof superStep.step.ratioSide !== 'undefined') ?
				superStep.step.ratioSide : this.ratioSide;
			this.store[superStep.key] = Object.assign(
				superStep.step, { rect: this.getElementRect(superStep.step.class, ratioSide) }
			);
		});
		setElementSize(this.element, this.sizeRect, this.ratioSide);
		this.wrapper = setWrapper(this.element);
		this.wrapperRect = setWrapperSize(
			this.wrapper, this.elementRect, this.sizeRect, this.pixelRounding
		);
		return superSteps.map((superStep) => {
			return this.store[superStep.key];
		});
	}

	/**
	* Measure transform properties to apply for each step
	* of the teleportation
	*
	* @method getTeleportationSteps
	*/
	getTeleportationSteps(steps) {
		for (let index = 1; index < steps.length; index++) {
			const previousStep = steps[index - 1];
			const step = steps[index];
			step.webAnimation = {
				animation: Object.assign({}, this.animation, step.animation),
				stepStyles: [
					{ transform: getTransform(previousStep.rect, this.wrapperRect, this.pixelRounding) },
					{ transform: getTransform(step.rect, this.wrapperRect, this.pixelRounding) }
				]
			};
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
	* Public API Method.
	* Animate element through all steps passed as arguments.
	*
	* @method teleport
	*/
	teleport(arg) {
		if (this.runningTeleportation && this.runningTeleportation.player) {
			this.runningTeleportation.player.cancel();
		}
		const steps = this.saveSteps(arg);
		this.runningTeleportation = { steps: this.getTeleportationSteps(steps) };
		this.runningTeleportation.stepIndex = 1;
		// Set styles and launch animation
		this.element.classList.remove('teleporter-idle');
		this.element.classList.add('teleporter-active');
		this.animate();
		// Return a promise that will resolve on teleportation end
		return new Promise((resolve, reject) => {
			Object.assign(this.runningTeleportation, { resolve, reject });
		});
	}

}
