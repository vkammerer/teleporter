import {schema} from './schema';
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
			<link rel="stylesheet" href="./category.css"/>
			<link rel="stylesheet" href="./schema.css"/>
			<link rel="stylesheet" href="./table.css"/>
			<link href='https://fonts.googleapis.com/css?family=Iceland' rel='stylesheet' type='text/css'>
			<script src="teleporter-global-polyfilled.js"></script>
			<script src="public-site.js"></script>
			</head>
			<body>
				${ribon}
				<div class="container">
					<header>
						<h1>
							<div id="logo"></div>Teleporter.js
						</h1>
					</header>
					<div class="content">
						<div class="section" id="introduction">
							<div class="pagename">The Hack</div>
							<div class="category">
								<div class="category-content">
									${schema}
									${introduction}
								</div>
							</div>
						</div>
						<div class="section" id="installation">
							<div class="pagename">Installation</div>
							<div class="category">
								<div class="category-content">
									${installation}
								</div>
							</div>
						</div>
						<div class="section" id="api">
							<div class="pagename">API</div>
							<div class="category">
								<div class="category-content">
									${api}
								</div>
							</div>
						</div>
						<div class="section" id="license">
							<div class="pagename">License</div>
							<div class="category">
								<div class="category-content">
									${license}
								</div>
							</div>
						</div>
					</div>
				</div>
			</body>
		</html>
	`
}
