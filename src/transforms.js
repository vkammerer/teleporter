export default function transforms(rect, dimensionsRect) {
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
