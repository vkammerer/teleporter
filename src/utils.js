/**
* Normalizes behavior of window.getComputedStyle
* with regards to shorthand properties
* (http://stackoverflow.com/questions/32295296/window-getcomputedstyle-not-working-in-other-browsers-except-chrome).
*
* @method normalizeGetComputedStyle
* @param {Object} element DOM element to get the properties from
* @return {Object} As returned by window.getComputedStyle,
* except for Firefox where only the background attributes are returned  
*/
export function normalizeGetComputedStyle(element) {
	// Firefox wtf
	if (window.getDefaultComputedStyle) {
		let styles = window.getComputedStyle(element);
		let backgroundStyles = Object.assign({}, {
			backgroundImage: styles.backgroundImage,
			backgroundPosition: styles.backgroundPosition,
			backgroundSize: styles.backgroundSize,
			backgroundRepeat: styles.backgroundRepeat,
			backgroundOrigin: styles.backgroundOrigin,
			backgroundClip: styles.backgroundClip,
			backgroundAttachment: styles.backgroundAttachment,
			backgroundColor: styles.backgroundColor
		});
		return backgroundStyles;
	}
	else {
		return Object.assign({}, window.getComputedStyle(element));
	}
}

/**
* Getter, pendant to the setter normalizeGetComputedStyle
* (see right above)
*
* @method normalizeApplyBackground
* @param {Object} element DOM element to get the properties from
* @param {Object} style CSS styles to apply
*/
export function normalizeApplyBackground(element, style) {
	// Firefox wtf
	if (window.getDefaultComputedStyle) {
		Object.assign(element.style, {
			backgroundImage: style.backgroundImage,
			backgroundPosition: style.backgroundPosition,
			backgroundSize: style.backgroundSize,
			backgroundRepeat: style.backgroundRepeat,
			backgroundOrigin: style.backgroundOrigin,
			backgroundClip: style.backgroundClip,
			backgroundAttachment: style.backgroundAttachment,
			backgroundColor: style.backgroundColor
		});
	}
	else {
		Object.assign(element.style, {
			background: style.background
		});
	}
}
