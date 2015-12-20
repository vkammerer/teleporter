/**
* Gets the 'rect' (rectangle) of a given element,
* independently of the scroll position;
*
* @method normalizeRect
* @param {Object} element Dom element to get the measures from
* @return {Object} rectangle object
*/
export function normalizeRect(element) {
	let rect = element.getBoundingClientRect();
	return Object.assign({}, {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX,
		width: rect.width,
		height: rect.height
	})
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
