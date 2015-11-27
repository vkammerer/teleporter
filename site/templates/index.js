import {logo} from './logo';
import {ribon} from './ribon';

export default function template(introduction, installation, api, license) {
	return `
		<html>
			<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<link rel="stylesheet" href="./normalize.css"/>
			<link rel="stylesheet" href="./main.css"/>
			<link rel="stylesheet" href="./section.css"/>
			<link rel="stylesheet" href="./table.css"/>
			<link href='https://fonts.googleapis.com/css?family=Timmana' rel='stylesheet' type='text/css'>
			<script src="teleporter-global-polyfilled.js"></script>
			</head>
			<body>
				${ribon}
				<div class="container">
					<header>
						<h1>
							${logo}
							Teleporter.js</h1>
					</header>
					<div class="content">
						<div class="section">
							<div id="introduction" class="category">
								${introduction}
							</div>
						</div>
						<div class="section"></div>
						<div class="section">
							<div id="installation" class="category">
								${installation}
							</div>
						</div>
						<div class="section"></div>
						<div class="section">
							<div id="api" class="category">
								${api}
							</div>
						</div>
						<div class="section"></div>
						<div class="section">
							<div id="license" class="category">
								${license}
							</div>
						</div>
					</div>
				</div>
				<script>
					var init = function(){
						[
							'introduction',
							'installation',
							'api',
							'license'
						].forEach(function(category){
								var myElement = new Teleporter({
									selector: '#' + category,
									sizeClass: 'normal',
									animation: {
										duration: 300,
										easing: 'cubic-bezier(0,0,0.32,1)'
									}
								});
								var normal = false;
								myElement.element.addEventListener("click",function(){
									myElement.element.parentElement.classList.add('selected');
									myElement.element.classList.add('active')
									myElement
										.teleport(normal ? ['normal','thumbnail']: ['thumbnail','normal'])
										.then(function(){
											if (!normal) {
												myElement.element.classList.remove('active')
												myElement.element.parentElement.classList.remove('selected');
											}
										})
									normal = !normal;
								});
							});
					}
					window.onload = init;
				</script>
			</body>
		</html>
	`
}
