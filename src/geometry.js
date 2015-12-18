/**
* Gets the 'rect' (rectangle) of a given element,
* independently of the scroll position;
*
* @method normalizeRect
* @param {Object} element Dom element to get the measures from
* @return {Object} rectangle object
*/
function normalizeRect(element) {
	let rect = element.getBoundingClientRect();
	return Object.assign({}, {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX,
		width: rect.width,
		height: rect.height
	})
}


/**
* Gets size and position of the element when applied a certain class.
*
* @method getRect
* @param {String} className The name of the class to apply
* to the element. Not required.
* @return {Object} Returns a 'rect' object as returned by Element.getBoundingClientRect()
* (https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
*/
export function getRect(element, className) {
	if (
		(typeof className === 'string') &&
		(className.length > 0)
	) {
		element.classList.add(className);
		let rect = normalizeRect(element);
		element.classList.remove(className);
		return rect;
	}
	return normalizeRect(element);
}

/**
* Measures the value of the CSS 'transform' property to apply
* to a node to give it the size and the position of another node.
*
* @method getTransform
* @param {Object} rect Contains the size and position of the node
* as should be rendered on the page
* @param {Object} sizeRect Contains the size and position
* of the original rasterized node
* @return {String} CSS 'transform' property to apply
*/
export function getTransform(rect, sizeRect) {
	let scX = rect.width / sizeRect.width;
	let scY = rect.height / sizeRect.height;
	let trX = rect.left - sizeRect.left + (rect.width - sizeRect.width) / 2;
	let trY = rect.top - sizeRect.top + (rect.height - sizeRect.height) / 2;
	return `
		translateX(${trX}px)
		translateY(${trY}px)
		scaleX(${scX})
		scaleY(${scY})
	`
}
