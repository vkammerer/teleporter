export const constructorArgument = (arg) => {
	let returnVal;
	let defaults = {
		animation: {
			duration: 1000,
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
