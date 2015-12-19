var initNavigation = function(){

	var categorieNames = [
		'introduction',
		'installation',
		'api',
		'examples'
	]

	var animation = window.innerWidth < 769 ? {
		// Mobile animations
		duration: 500,
		easing: 'cubic-bezier(0,0,0.45,1)'
	} : {
		// Desktop animations
		duration: 320,
		easing: 'cubic-bezier(0,0,0.32,1)'
	}

	categories = categorieNames.map(function(categoryName){
		return {
			name: categoryName,
			expanded: false,
			options: {
				selector: '#' + categoryName + ' .category',
				sizeClass: 'expanded',
				animation: animation
			}
		}
	})

	var openCategory = function(category){
		category.teleporter.element.parentElement.classList.add('selected');
		category.teleporter.element.classList.add('active');
		category.expanded = true;
		return category.openingTeleportation.run();
	}
	var closeCategory = function(category){
		category.teleporter.element.parentElement.classList.remove('selected');
		category.teleporter.element.classList.remove('active');
		category.expanded = false;
		return category.closingTeleportation.run();
	}

	var onCategoryClick = function(selectedCategory){
		var currentCategory = categories.filter(function(cat){
			return cat.expanded
		})[0]
		closeCategory(currentCategory);
		openCategory(selectedCategory);
	}

	categories.forEach(function(category){
		category.teleporter = new Teleporter(category.options);
		category.openingTeleportation = category.teleporter.createTeleportation(['', 'expanded']);
		category.closingTeleportation = category.teleporter.createTeleportation(['expanded', '']);
		document.querySelector('#' + category.name).addEventListener("click", function(){
			if (category.expanded) { return }
			onCategoryClick(category);
		});
	});
	document.body.classList.add('navigation-ready');
	openCategory(categories[0])

	// Expose it, so that anyone can play with it
	window.categories = categories

}
