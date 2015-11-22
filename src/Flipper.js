import { constructorArgument, transitionArgument } from './arguments';
import transforms from './transforms';

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

	/*
		Static methods
	*/

	/*
		Get rect for a specific class
		(as returned by 'getBoundingClientRect')
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
	/*
		Modify style modification to render a node
		with other position and dimension attributes
	*/
	setModificationStyles(initialRect, dimensionsRect) {
		Object.assign(this.element.style, {
			width: `${dimensionsRect.width}px`,
			height: `${dimensionsRect.height}px`
		})
		let afterDimensionsRect = this.element.getBoundingClientRect();
		Object.assign(this.element.style, {
			marginLeft: `${initialRect.left - afterDimensionsRect.left}px`,
			marginRight: `${initialRect.right - afterDimensionsRect.right}px`,
			marginTop: `${initialRect.top - afterDimensionsRect.top}px`,
			marginBottom: `${initialRect.bottom - afterDimensionsRect.bottom}px`
		})
		let afterMarginsRect = this.element.getBoundingClientRect();
		Object.assign(this.element.style, {
			transform: transforms(initialRect, afterMarginsRect)
		})
	}
	/*
		Reset modified node style attributes
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
	/*
		Public API: sets dimensions of the node and transforms its style
	*/
	setDimensionsClass(arg) {
		if (typeof arg !== 'string') {
			console.error(`Flipper.js: No valid argument passed to method 'setDimensionClass'`);
			return;
		}
		this.dimensionsClass = arg;
		this.resetModificationStyles();
		this.setModificationStyles(this.getRect(), this.getRect(this.dimensionsClass))
	}

	/*
		Transition methods
	*/

	/*
		Define rect for each step of the transition
	*/
	setTransitStepsRects() {
		this.transit.steps.forEach((obj) => {
			obj.rect = this.getRect(obj.class)
		})
	}
	/*
		Define rect for the dimensions during the transition:
		either the rect of the dimensionsClass,
		or a rect of a node with maximal dimensions
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
	/*
		Animate from one step to the next until the transition end
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
	/*
		Public API: starts transition between each class
	*/
	transition(arg) {
		// Check arguments format
		let formattedArg = transitionArgument(arg);
		if (!formattedArg) {
			console.error(`Flipper.js: No valid argument passed to method 'transition'`);
			return;
		}

		// Clean up potential ongoing transition
		if (this.transit && this.transit.player) {
			this.transit.player.cancel();
		}
		this.resetModificationStyles();


		// Build the transit attribute for the upcoming transition
		this.transit = { steps: formattedArg };
		this.setTransitStepsRects();
		this.setTransitDimensionsRect();

		// Set styles and launch animation
		this.setModificationStyles(this.transit.steps[0].rect, this.transit.dimensionsRect);
		this.animate(0);

		// return a promise that will resolve on transition end
		return new Promise((resolve, reject) => {
			Object.assign(this.transit, {
				resolve: resolve,
				reject: reject
			});
		});
	}

}
