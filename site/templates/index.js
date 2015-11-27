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
			<script src="public-site.js"></script>
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
							<div class="pagename">Introduction</div>
							<div id="introduction" class="category">
								${introduction}
							</div>
						</div>
						<div class="section"></div>
						<div class="section">
							<div class="pagename">Installation</div>
							<div id="installation" class="category">
								${installation}
							</div>
						</div>
						<div class="section"></div>
						<div class="section">
							<div class="pagename">API</div>
							<div id="api" class="category">
								${api}
							</div>
						</div>
						<div class="section"></div>
						<div class="section">
							<div class="pagename">License</div>
							<div id="license" class="category">
								${license}
							</div>
						</div>
					</div>
				</div>
			</body>
		</html>
	`
}
