import {ribon} from './ribon';

export default function template(content) {
	return `
		<html>
			<head>
			<link rel="stylesheet" href="./normalize.css"/>
			<link rel="stylesheet" href="./main.css"/>
			</head>
			<body>
				${ribon}
				<div class="container">
					<header>
						<h1>Teleporter.js</h1>
					</header>
					<div class="content">
						${content}
					</div>
				</div>
			</body>
		</html>
	`
}
