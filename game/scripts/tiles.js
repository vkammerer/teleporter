window.initTiles = function(itemsNum){

	var indexes = Array.from(Array(itemsNum).keys());
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

	return tilesFragment;

}

window.teleportTiles = function(itemsNum){

	var indexes = Array.from(Array(itemsNum).keys());
	var shuffledIndexes = shuffle(Array.from(Array(itemsNum).keys()));

	var animation = window.innerWidth < 769 ? {
		// Mobile animations
		duration: 500,
		easing: 'cubic-bezier(0,0,0.45,1)'
	} : {
		// Desktop animations
		duration: 320,
		easing: 'cubic-bezier(0,0,0.32,1)'
	}

	return indexes.map(function(index){
		return {
			index: index,
			shuffledIndex: shuffledIndexes[index],
			element: document.querySelector('#tile_' + index + ''),
			content: document.querySelector('#tile_' + index + ' .content'),
			teleporter: new Teleporter({
				selector: '#tile_' + index,
				pixelRounding: false,
				animation: animation
			}),
		};
	})

}
