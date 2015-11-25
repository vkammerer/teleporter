import {logo} from './logo';
import {ribon} from './ribon';

export default function template(introduction, installation, api, license) {
	return `
		<html>
			<head>
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<link rel="stylesheet" href="./normalize.css"/>
			<link rel="stylesheet" href="./main.css"/>
			<link rel="stylesheet" href="./logo.css"/>
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
						<div id="introduction" class="section">
							${introduction}
						</div>
						<div class="section"></div>
						<div id="installation" class="section">
							${installation}
						</div>
						<div class="section"></div>
						<div id="api" class="section">
							${api}
						</div>
						<div class="section"></div>
						<div id="license" class="section">
							${license}
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
						].forEach(function(section){
								var myElement = new Teleporter({
									selector: '#' + section,
									sizeClass: 'normal',
									animation: {
										duration: 400,
										easing: 'cubic-bezier(0,0,0.32,1)'
									}
								});
								var normal = false;
								myElement.element.addEventListener("click",function(){
									myElement.element.classList.add('above')
									myElement
										.teleport(normal ? ['normal','thumbnail']: ['thumbnail','normal'])
										.then(function(){
											if (!normal) {
												myElement.element.classList.remove('above')
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
