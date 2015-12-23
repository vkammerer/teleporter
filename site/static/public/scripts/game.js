function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

window.initGame = function(){

	var style = document.documentElement.appendChild(document.createElement('style'));
	var _100 = Array.from(Array(100).keys());
	var _101 = Array.from(Array(101).keys());

	_101.forEach(function(index){
		style.sheet.insertRule(
			'.baby:nth-child('
			+ (index + 1)
			+ ') .content {background-position: '
			+ 'top calc(' + (index - (index % 10)) + '% - ' + Math.floor(index / 10) * 0.7 + 'vh) '
			+ 'left calc(' + ((index % 10) * 10) + '% - ' + (index % 10) * 0.8  + 'vw);'
			+ '}'
		, 0);
	})
	_101.forEach(function(index){
		style.sheet.insertRule('.baby.pos_' + (index) + ' {order: ' + (index * 2 - 1) + '}', index);
	})
	_101.forEach(function(index){
		style.sheet.insertRule('.baby:nth-child(' + (index + 1) + ') {order: ' + (index * 2) + '}', 0);
	})

	var fragment = document.createDocumentFragment();

	_100.forEach(function(index){
		var div = document.createElement('div')
		div.className = 'baby';
		div.id = 'tile_' + JSON.stringify(index);
		var ballContent = document.createElement('div');
		ballContent.className = 'content';
		div.appendChild(ballContent);
		fragment.appendChild(div);
	})

	document.querySelector('#game').appendChild(fragment);

	var animation = window.innerWidth < 769 ? {
		// Mobile animations
		duration: 500,
		easing: 'cubic-bezier(0,0,0.45,1)'
	} : {
		// Desktop animations
		duration: 320,
		easing: 'cubic-bezier(0,0,0.32,1)'
	}

	var balls = []
	var _100_ = shuffle(Array.from(Array(100).keys()));

	_100.forEach(function(index){
		balls.push({
			teleporter: new Teleporter({
				selector: '#tile_' + index,
				pixelRounding: false,
				animation: animation
			}),
			tile: document.querySelector('#tile_' + index + ' .content'),
			posIndex : (index < _100_[index]) ? _100_[index] + 1 : _100_[index]
		})

		var ball = balls[index];
		ball.teleporter.saveSteps(['pos_' + index, 'pos_' + ball.posIndex]);

		ball.tile.addEventListener('click', function(){
			ball.teleporter.element.classList.add('selected');
			selection.push(index);
			if (selection.length === 3) {
				selection.forEach(function(selectionIndex){
					var thisBall = balls[selectionIndex];
					thisBall.teleporter.teleport(['pos_' + thisBall.posIndex, 'pos_' + selectionIndex]).then(function(){
						thisBall.teleporter.element.classList.remove('selected');
						thisBall.wrapper = document.querySelector('#tile_' + selectionIndex + ' .teleporter-wrapper');
						thisBall.wrapper.style.zIndex = 0;
					})
				})
				selection = [];
			}
		});

		ball.teleporter.teleport('pos_' + ball.posIndex).then(function(){
			ball.wrapper = document.querySelector('#tile_' + index + ' .teleporter-wrapper');
			ball.wrapper.style.zIndex = ball.posIndex;
			ball.wrapper.style.backgroundColor = 'blue';
			console.log(ball.wrapper)
		});

	})

	var selection = [];

	document.body.classList.add('navigation-ready');

}
