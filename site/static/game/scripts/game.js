window.init = function(columnNum, lineNum){

	var tilesNum = columnNum * lineNum;

	var tilesFragment = initTiles(tilesNum);
	var layoutFragment = initLayout(columnNum, lineNum);

	document.querySelector('#game').appendChild(tilesFragment);
	document.querySelector('#game').appendChild(layoutFragment);

	var tiles = teleportTiles(tilesNum);
	var selection = [];

	function handleClick(tile) {
		tile.element.classList.add('selected');
		selection.push(tile.index);
		if (selection.length === 2) {
			var tile0 = tiles[selection[0]];
			var tile1 = tiles[selection[1]];
			tile0.teleporter.teleport(['pos_' + tile0.shuffledIndex, 'pos_' + tile1.shuffledIndex]).then(function(){
				tile0.element.classList.remove('selected');
			});
			tile1.teleporter.teleport(['pos_' + tile1.shuffledIndex, 'pos_' + tile0.shuffledIndex]).then(function(){
				tile1.element.classList.remove('selected');
			});
			var tile0ShuffledIndex = tile0.shuffledIndex;
			tile0.shuffledIndex = tile1.shuffledIndex;
			tile1.shuffledIndex = tile0ShuffledIndex;
			selection = [];
		}
	}

	tiles.forEach(function(tile){
		tile.teleporter.saveSteps(['pos_' + tile.index, 'pos_' + tile.shuffledIndex]);
		tile.content.addEventListener('click', handleClick.bind(this, tile));
	})

	tiles.forEach(function(tile){
		tile.teleporter.teleport('pos_' + tile.index).then(function(){
			tile.element.classList.add('initialized');
		});
	})

	setTimeout(function(){
		tiles.forEach(function(tile){
			tile.teleporter.teleport(['pos_' + tile.index, 'pos_' + tile.shuffledIndex]);
		})

	}, 5000)

	document.body.classList.add('navigation-ready');

}
