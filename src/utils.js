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
