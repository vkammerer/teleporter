window.init = function(columnNum, lineNum){

	var gameReady = false;

	var renewImage = initStyles(columnNum, lineNum);

	var tilesNum = columnNum * lineNum;
	var scoresNode = document.querySelector('#scores');
	var gameNode = document.querySelector('#game');
	var tiles;

	function initGame(){
		gameReady = false;
		scores.innerHTML = 'Look carefully!';
		gameNode.innerHTML = '';
		var tilesFragment = getTilesFragment(tilesNum);
		var posFragment = getPosFragment(tilesNum);

		gameNode.appendChild(tilesFragment);
		gameNode.appendChild(posFragment);

		tiles = getTeleporterElements(tilesNum);
		tiles.forEach(function(tile){
			tile.teleporter.saveSteps(['pos_' + tile.index, 'pos_' + tile.shuffledIndex]);
			tile.content.addEventListener('click', onTileClick.bind(this, tile));
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
			scores.innerHTML = 'Click 2 tiles to move them';
			gameReady = true;
		}, 5000)

	}

	var selection = [];

	function onTileClick(tile) {
		if (!gameReady) {
			return;
		}
		if (
			(selection.length === 1) &&
			(selection[0] === tile.index)
		) {
			tile.element.classList.remove('selected');
			return;
		}
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
				if (isFinished()) {
					scores.innerHTML = 'Yay!';
					setTimeout(function(){
						renewImage()
						initGame()
					}, 2000);
				}
			});
			var tile0ShuffledIndex = tile0.shuffledIndex;
			tile0.shuffledIndex = tile1.shuffledIndex;
			tile1.shuffledIndex = tile0ShuffledIndex;
			selection = [];
		}
	}

	function isFinished() {
		return tiles.every(function(tile){
			return (tile.index === tile.shuffledIndex)
		});
	}

	initGame();

	document.body.classList.add('navigation-ready');

}
