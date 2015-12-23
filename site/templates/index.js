import {schema} from './schema';
import {ribon} from './ribon';
import {analytics} from './analytics';

export default function template(introductionDoc, installationDoc, apiDoc, gotchasDoc, examplesDoc) {
	return `
		<html>
			<head>
			<meta charset="utf-8">
			<title>Teleporter.js</title>
			<meta name="description" content="Hardware Accelerated Animations with boring CSS properties">
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<link rel="stylesheet" href="./common/styles/normalize.css"/>
			<link rel="stylesheet" href="./public/styles/main.css"/>
			<link rel="stylesheet" href="./public/styles/section.css"/>
			<link rel="stylesheet" href="./public/styles/category.css"/>
			<link rel="stylesheet" href="./public/styles/schema.css"/>
			<link href='https://fonts.googleapis.com/css?family=Iceland' rel='stylesheet' type='text/css'>
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
									<h2>The Hack</h2>
									${schema}
									${introductionDoc}
								</div>
							</div>
						</div>
						<div class="section" id="installation">
							<div class="pagename">Installation</div>
							<div class="category">
								<div class="category-content">
									${installationDoc}
								</div>
							</div>
						</div>
						<div class="section" id="api">
							<div class="pagename">API</div>
							<div class="category">
								<div class="category-content">
									${apiDoc}
								</div>
							</div>
						</div>
						<div class="section" id="gotchas">
							<div class="pagename">Gotchas</div>
							<div class="category">
								<div class="category-content">
									${gotchasDoc}
								</div>
							</div>
						</div>
						<div class="section" id="examples">
							<div class="pagename">Examples</div>
							<div class="category">
								<div class="category-content">
									${examplesDoc}
									<h4>On this site</h4>
									<p>The navigation of this site is animated with Teleporter.</p>
									<p>The thumbnail versions of the sections are layed out with Flexbox, and the expanded versions are absolutely positioned.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<script src="./common/scripts/teleporter-global-polyfilled.js"></script>
				<script src="./public/scripts/navigation.js"></script>
				<script>
					window.onload = function(){
						initNavigation();
					};
				</script>
				${analytics}
			</body>
		</html>
	`
}
