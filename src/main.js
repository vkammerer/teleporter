let getTransform = (rect, maximalRect) => {
	let scX = rect.width / maximalRect.width;
	let scY = rect.height / maximalRect.height;
	let trX = rect.left - maximalRect.left + (rect.width - maximalRect.width) / 2;
	let trY = rect.top - maximalRect.top + (rect.height - maximalRect.height) / 2;
	return `
		translateX(${trX}px)
		translateY(${trY}px)
		scaleX(${scX})
		scaleY(${scY})
	`
}

export default class Flipper {
	constructor(options) {
		if (!options.selector) {
			console.error(`Flipper.js: No 'selector' argument provided`);
			return;
		};
		this.element = document.querySelector(options.selector);
		if (!this.element) {
			console.error(`Flipper.js: No element found with the selector '${this.options.selector}'`);
			return;
		};
		this.options = Object.assign({
			originalClass: this.element.className,
			duration: 1000,
			easing: 'linear'
		}, options);
	}
	setClass(className) {
		this.element.className = this.options.originalClass + ' ' + className;
	}
	setMaximalDimensions(maximalRect) {
		this.element.style.width = maximalRect.width;
		this.element.style.height = maximalRect.height;
	}
	resetElement() {
		this.element.style.transform = null;
		this.element.style.width = null;
		this.element.style.height = null;		
	}
	animate(initialTransform, finalTransform, options) {
		let animationOptions = Object.assign({}, this.options, options);
		this.element.style.transform = finalTransform;
		let animation = this.element.animate([
		  { transform: initialTransform },
		  { transform: finalTransform }
		], {
		  duration: animationOptions.duration,
		  easing: animationOptions.easing
		});
		// animation.addEventListener('finish', tidyUpAnimations);
	}
	transition(initialClass, finalClass, options) {
		this.resetElement()
		this.setClass(finalClass);
		let finalRect = this.element.getBoundingClientRect();
		this.setClass(initialClass);
		let initialRect = this.element.getBoundingClientRect();
		let maximalRect = {
			left: initialRect.left,
			top: initialRect.top,
			width: Math.max(initialRect.width, finalRect.width),
			height: Math.max(initialRect.height, finalRect.height)
		}
		let initialTransform = getTransform(initialRect, maximalRect);
		let finalTransform = getTransform(finalRect, maximalRect);

		this.setMaximalDimensions(maximalRect);
		this.animate(initialTransform, finalTransform, options);

	}
}
