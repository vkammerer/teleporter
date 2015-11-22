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
* 	dimensionsClass: 'myclass',
* 	animation: {
* 		duration: 800,
* 		easing: 'linear'
* 	}
* }
*/
export const constructorArgument = (arg) => {
	let returnVal;
	let defaults = {
		animation: {
			duration: 800,
			easing: 'linear'
		}
	}
	if (typeof arg === 'string') {
		returnVal = Object.assign({}, defaults, { selector: arg });
	}
	else if (
		(typeof arg === 'object') &&
		(typeof arg.selector === 'string')
	){
		let plucked = { selector: arg.selector }
		if (typeof arg.dimensionsClass === 'string') {
			plucked.dimensionsClass = arg.dimensionsClass
		}
		if (typeof arg.animation === 'object') {
			let animation = {}
			if (typeof arg.animation.duration === 'number') {
				animation.duration = arg.animation.duration
			}
			if (typeof arg.animation.easing === 'string') {
				animation.easing = arg.animation.easing
			}
			if (Object.keys(animation).length > 0) {
				plucked.animation = animation
			}
		}
		returnVal = Object.assign({}, defaults, plucked);
	}
	return returnVal
}

/**
* Checks and normalizes the arguments passed to the 'transition' method.
*
* @method transitionArgument
* @param {String|Object|Array} arg Transition steps:
* - if type if 'String', it defines the class of the final state,
* and implicitly sets the default state as the initial state
* - if type if 'Object', it defines the options of the final state,
* and implicitly sets the default state as the initial state
* - if type if 'Array', it defines all steps of the transition.
* @return {Array} Normalized array of objects with the following format:
* {
* 	class: 'myclass',
* 	animation: {
* 		duration: 800,
* 		easing: 'linear'
* 	}
* }
*/
export const transitionArgument = (arg) => {
	let returnVal;
	if (typeof arg === 'string') {
		returnVal = [{ class: '' }, { class: arg } ]
	}
	else if (typeof arg === 'object') {
		if (typeof arg.class === 'string') {
			returnVal = [{ class: '' }, arg ]
		}
		else if (Array.isArray(arg)) {
			returnVal = [];
			if (arg.length === 1) {
				returnVal.push({ class: '' });
			}
			for (var i = 0; i < arg.length; i++) {
				if (typeof arg[i] === 'string') {
					returnVal.push({ class: arg[i] })
				}
				else if (
					(typeof arg[i] === 'object') &&
					(typeof arg[i].class === 'string')
				) {
					returnVal.push(arg[i])
				}
				else {
					returnVal = undefined;
					break;
				}
			}
		}
	}
	return returnVal
}
