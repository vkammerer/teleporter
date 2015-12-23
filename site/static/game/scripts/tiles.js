window.init = function(columnNum, lineNum){

	var itemsNum = columnNum * lineNum;

	var indexes = Array.from(Array(itemsNum).keys());
	var shuffledIndexes = shuffle(Array.from(Array(itemsNum).keys()));
	var tilesFragment = document.createDocumentFragment();

	indexes.forEach(function(index){
		var tile = document.createElement('div')
		var tileContent = document.createElement('div');
		tile.className = 'tile';
		tileContent.className = 'content';
		tile.id = 'tile_' + JSON.stringify(index);
		tile.appendChild(tileContent);
		tilesFragment.appendChild(tile);
	})

	document.querySelector('#game').appendChild(tilesFragment);
	document.querySelector('#game').appendChild(initLayout(columnNum, lineNum));

	var animation = window.innerWidth < 769 ? {
		// Mobile animations
		duration: 500,
		easing: 'cubic-bezier(0,0,0.45,1)'
	} : {
		// Desktop animations
		duration: 320,
		easing: 'cubic-bezier(0,0,0.32,1)'
	}

	var tiles = [];

	function handleClick(tile) {
		tile.teleporter.element.classList.add('selected');
		selection.push(tile.index);
		if (selection.length === 2) {
			var tile0 = tiles[selection[0]];
			var tile1 = tiles[selection[1]];
			tile0.teleporter.teleport(['pos_' + shuffledIndexes[tile0.index], 'pos_' + shuffledIndexes[tile1.index]]).then(function(){
				tile0.teleporter.element.classList.remove('selected');
			});
			tile1.teleporter.teleport(['pos_' + shuffledIndexes[tile1.index], 'pos_' + shuffledIndexes[tile0.index]]).then(function(){
				tile1.teleporter.element.classList.remove('selected');
			});
			var shuffledIndexesTile0 = shuffledIndexes[tile0.index];
			shuffledIndexes[tile0.index] = shuffledIndexes[tile1.index];
			shuffledIndexes[tile1.index] = shuffledIndexesTile0;
			selection = [];
		}
	}

	indexes.forEach(function(index){
		var tile = tiles[index] = {
			index: index,
			teleporter: new Teleporter({
				selector: '#tile_' + index,
				pixelRounding: false,
				animation: animation
			}),
			content: document.querySelector('#tile_' + index + ' .content'),
		};

		tile.teleporter.saveSteps(['pos_' + index, 'pos_' + shuffledIndexes[index]]);
		tile.content.addEventListener('click', handleClick.bind(this, tile));

	})

	indexes.forEach(function(index){
		var tile = tiles[index];
		tile.teleporter.teleport('pos_' + index).then(function(){
			tile.teleporter.element.classList.add('initialized');
		});
	})

	setTimeout(function(){
		indexes.forEach(function(index){
			var tile = tiles[index];
			tile.teleporter.teleport(['pos_' + index, 'pos_' + shuffledIndexes[index]]);
		})

	}, 5000)



	var selection = [];

	document.body.classList.add('navigation-ready');

}
