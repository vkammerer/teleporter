function initImage(styleSheet, gameSize, bgSize){
	styleSheet.insertRule(
		'.tile .content {'
		+ 'background-image: url(http://lorempixel.com/'
		+ (gameSize.width)
		+ '/'
		+ (gameSize.height)
		+ '/animals/?v='
		+ Date.now()
		+ '); '
		+ 'background-size: '
		+ (bgSize.width)
		+ '% '
		+ (bgSize.height)
		+ '%;}'
	, styleSheet.cssRules.length);
}

window.initStyles = function(columnNum, lineNum){

	var styleSheet = document.head.appendChild(document.createElement('style')).sheet;

	var gameOriginalRect = document.querySelector('#game').getBoundingClientRect();
	var gameSize = {
		width: gameOriginalRect.width - (gameOriginalRect.width % columnNum),
		height: gameOriginalRect.height - (gameOriginalRect.height % lineNum)
	}

	styleSheet.insertRule(
		'#game {width: '
		+ gameSize.width
		+ 'px; height: '
		+ gameSize.height
		+ 'px;}'
	, styleSheet.cssRules.length);

	var itemsNum = columnNum * lineNum;
	var indexes = Array.from(Array(itemsNum).keys());

	var gameVw = 80;
	var gameVh = 80;
	var itemWidth = 100 / columnNum;
	var itemHeight = 100 / lineNum;
	var bgSize = {
		width: 100 * columnNum,
		height: 100 * lineNum
	}
	var widthBgOffset = gameSize.width / columnNum / columnNum;
	var heightBgOffset = gameSize.height / lineNum / lineNum;

	styleSheet.insertRule(
		'#game > div {width: '
		+ (itemWidth)
		+ '%; height: '
		+ (itemHeight)
		+ '%;}'
	, styleSheet.cssRules.length);
	initImage(styleSheet, gameSize, bgSize);

	indexes.forEach(function(index) {
		var columnIndex = index % columnNum;
		var lineIndex = Math.floor(index / columnNum);
		styleSheet.insertRule(
			'.tile:nth-child('
			+ (index + 1)
			+ ') .content {background-position: '
			+ 'left calc(' + (columnIndex * itemWidth) + '% - ' + columnIndex * widthBgOffset + 'px) '
			+ 'top calc(' + (lineIndex * itemHeight) + '% - ' + lineIndex * heightBgOffset + 'px);'
			+ '}'
		, styleSheet.cssRules.length);
	})

	indexes.forEach(function(index) {
		styleSheet.insertRule('.pos_' + (index) + ' {order: ' + (index) + ';}', styleSheet.cssRules.length);
	})

	return initImage.bind(this, styleSheet, gameSize, bgSize);

}

window.getPosFragment = function(itemsNum){

	var indexes = Array.from(Array(itemsNum).keys());

	var positionsFragment = document.createDocumentFragment();
	indexes.forEach(function(index){
		var position = document.createElement('div')
		position.className = 'pos_' + index;
		positionsFragment.appendChild(position);
	})

	return positionsFragment;


}
