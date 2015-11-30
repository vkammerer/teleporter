/**
* Measures the value of the CSS 'transform' property to apply
* to a node to give it the size and the position of another node.
*
* @method transforms
* @param {Object} rect Contains the size and position of the node
* as should be rendered on the page
* @param {Object} dimensionsRect Contains the size and position
* of the original rasterized node 
* @return {String} CSS 'transform' property to apply
*/
export function transforms(rect, dimensionsRect) {
	let scX = rect.width / dimensionsRect.width;
	let scY = rect.height / dimensionsRect.height;
	let trX = rect.left - dimensionsRect.left + (rect.width - dimensionsRect.width) / 2;
	let trY = rect.top - dimensionsRect.top + (rect.height - dimensionsRect.height) / 2;
	return `
		translateX(${trX}px)
		translateY(${trY}px)
		scaleX(${scX})
		scaleY(${scY})
	`
}

export function normalizeRect(element) {
	let rect = element.getBoundingClientRect();
	return Object.assign({}, {
		top: rect.top + window.scrollY,
		left: rect.left + window.scrollX,
		width: rect.width,
		height: rect.height
	})
}
