window.initGame = function(){

	var classNames = [
		'introduction',
		'installation',
		'api',
		'examples'
	]

	var oneToTen = Array.from(Array(10).keys());
	var steps = oneToTen.map(function(index){
		return 'pos_' + (index + 1);
	})

	var animation = window.innerWidth < 769 ? {
		// Mobile animations
		duration: 500,
		easing: 'cubic-bezier(0,0,0.45,1)'
	} : {
		// Desktop animations
		duration: 320,
		easing: 'cubic-bezier(0,0,0.32,1)'
	}

	var ball = new Teleporter({
		selector: '#ball',
		sizeClass: 'pos_0',
		ratioSide: 'width',
		animation: animation
	});

	console.log(steps);

	ball.saveSteps(steps);

	document.body.classList.add('navigation-ready');
	document.body.addEventListener('click', ball.teleport.bind(ball, steps));

	// Expose it, so that anyone can play with it
	// window.categories = categories

}
