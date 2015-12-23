window.initLayout = function(columnNum, lineNum){

	var styleSheet = document.head.appendChild(document.createElement('style')).sheet;

	var gameOriginalRect = document.querySelector('#game').getBoundingClientRect();
	var gameRect = {
		width: gameOriginalRect.width - (gameOriginalRect.width % columnNum),
		height: gameOriginalRect.height - (gameOriginalRect.height % lineNum)
	}

	styleSheet.insertRule(
		'#game {width: '
		+ gameRect.width
		+ 'px; height: '
		+ gameRect.height
		+ 'px;}'
	, styleSheet.cssRules.length);

	var itemsNum = columnNum * lineNum;
	var indexes = Array.from(Array(itemsNum).keys());

	var gameVw = 80;
	var gameVh = 80;
	var itemWidth = 100 / columnNum;
	var itemHeight = 100 / lineNum;
	var backgroundWidth = 100 * columnNum;
	var backgroundHeight = 100 * lineNum;
	var widthBgOffset = gameRect.width / columnNum / columnNum;
	var heightBgOffset = gameRect.height / lineNum / lineNum;

	styleSheet.insertRule(
		'#game > div {width: '
		+ (itemWidth)
		+ '%; height: '
		+ (itemHeight)
		+ '%;}'
	, styleSheet.cssRules.length);
	styleSheet.insertRule(
		'.tile .content {'
		+ 'background-image: url(http://lorempixel.com/'
		+ (gameRect.width)
		+ '/'
		+ (gameRect.height)
		+ '/animals); '
		+ 'background-size: '
		+ (backgroundWidth)
		+ '% '
		+ (backgroundHeight)
		+ '%;}'
	, styleSheet.cssRules.length);

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

	var positionsFragment = document.createDocumentFragment();
	indexes.forEach(function(index){
		var position = document.createElement('div')
		position.className = 'pos_' + index;
		positionsFragment.appendChild(position);
	})

	return positionsFragment;

}
