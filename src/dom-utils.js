import {
	getRect,
	getTransform
} from './geometry';

/**
* Sets a div as direct child of the element,
* and wraps all other children nodes in it.
*
* @function setWrapper
*/
export function setWrapper(element) {
	let elementRect = getRect(element);
	Object.assign(element.style, {
		width: `${elementRect.width}px`,
		height: `${elementRect.height}px`
	});
	let wrapper = document.createElement('div');
	wrapper.className = 'teleporter-wrapper';
	while (element.childNodes.length > 0) {
		wrapper.appendChild(element.childNodes[0]);
	}
	element.insertBefore(wrapper, null);
	return wrapper;
}

/**
* Applies inline style attributes to modify the element
* from the state of the original rasterized node to the current state.
*
* @method setWrapperStyles
* @param {Object} rect Contains the size and position
* of the element as it should be displayed on the page.
* @param {Object} sizeRect Contains the size of the element
* that should be used to create the original rasterized node.
*/
export function setWrapperStyles(wrapper, rect, sizeRect) {
	Object.assign(wrapper.style, {
		width: `${sizeRect.width}px`,
		height: `${sizeRect.height}px`,
		transform: null
	});
	let wrapperRect = wrapper.getBoundingClientRect();
	Object.assign(wrapper.style, {
		transform: getTransform(rect, wrapperRect)
	});
}

/**
* Resets the element to what it was originally,
* before all children nodes were wrapped in a wrapper.
*
* @function resetElement
*/
export function resetElement(element) {
	let wrapper = element.children[0];
	if (wrapper && wrapper.classList.contains('teleporter-wrapper')) {
		while (wrapper.childNodes.length > 0) {
			element.appendChild(wrapper.childNodes[0]);
		}
		element.removeChild(wrapper);
	}
	Object.assign(element.style, {
		width: null,
		height: null
	});
}
