function normalizeAnimation(arg) {
	const animation = {};
	if (typeof arg.animation.duration === 'number') {
		animation.duration = arg.animation.duration;
	}
	if (typeof arg.animation.delay === 'number') {
		animation.delay = arg.animation.delay;
	}
	if (typeof arg.animation.easing === 'string') {
		animation.easing = arg.animation.easing;
	}
	return animation;
}

/**
* Checks and normalizes the arguments passed to the constructor.
*
* @method constructorArgument
* @param {String|Object} arg:
* - if type if 'String', it refers to the selector of the DOM element
* (as should be passed to document.querySelector).
* - if type if 'Object', it must include a selector attribute,
* and can include additional options.
* @return {Object} Normalized object with the following format:
* {
* 	selector: '#myid',
* 	sizeClass: 'myclass',
* 	animation: {
* 		duration: 800,
* 		easing: 'linear'
* 	}
* }
*/
export const constructorArgument = (arg) => {
	const defaults = {
		pixelRounding: true,
		animation: {
			duration: 800,
			delay: 0,
			easing: 'linear'
		}
	};
	if (typeof arg === 'string') {
		return Object.assign({}, defaults, { selector: arg });
	}
	else if (
		(typeof arg === 'object') &&
		(typeof arg.selector === 'string')
	) {
		const plucked = { selector: arg.selector };
		if (typeof arg.sizeClass === 'string') {
			plucked.sizeClass = arg.sizeClass;
		}
		if (typeof arg.ratioSide === 'string') {
			plucked.ratioSide = arg.ratioSide;
		}
		if (typeof arg.pixelRounding === 'boolean') {
			plucked.pixelRounding = arg.pixelRounding;
		}
		if (typeof arg.animation === 'object') {
			plucked.animation = normalizeAnimation(arg);
		}
		return Object.assign({}, defaults, plucked);
	}
	console.error(`Teleporter.js: No valid argument passed to the constructor`);
};

function normalizeStep(step) {
	if (typeof step.class !== 'string') {
		console.error(`Teleporter.js: No valid class passed to the teleportation step`);
		return undefined;
	}
	const plucked = {
		class: step.class
	};
	if (typeof step.opacity === 'number') {
		plucked.opacity = step.opacity;
	}
	if (typeof step.rotate === 'string') {
		plucked.rotate = step.rotate;
	}
	if (typeof step.ratioSide !== 'undefined') {
		plucked.ratioSide = step.ratioSide;
	}
	if (typeof step.animation === 'object') {
		plucked.animation = normalizeAnimation(step);
	}
	return plucked;
}

/**
* Checks and normalizes the arguments passed to the 'teleport' method.
*
* @method teleportArgument
* @param {String|Object|Array} arg Teleportation steps:
* - if type if 'String', it defines the class of the final state,
* and implicitly sets the default state as the initial state
* - if type if 'Object', it defines the options of the final state,
* and implicitly sets the default state as the initial state
* - if type if 'Array', it defines all steps of the teleportation.
* @return {Array} Normalized array of objects with the following format:
* {
* 	class: 'myclass',
* 	animation: {
* 		duration: 800,
* 		easing: 'linear'
* 	}
* }
*/
export const stepsArgument = (arg) => {
	if (typeof arg === 'string') {
		return [{ class: '' }, { class: arg }];
	}
	else if (typeof arg === 'object') {
		if (!Array.isArray(arg)) {
			return [{ class: '' }, normalizeStep(arg)];
		}
		let steps = [];
		if (arg.length === 1) {
			steps.push({ class: '' });
		}
		for (let i = 0; i < arg.length; i++) {
			if (typeof arg[i] === 'string') {
				steps.push({ class: arg[i] });
			}
			else if (typeof arg[i] === 'object') {
				steps.push(normalizeStep(arg[i]));
			}
			else {
				steps = undefined;
				break;
			}
		}
		if (steps) return steps;
	}
	console.error(`Teleporter.js: No valid argument passed to method stepsArgument`);
};
