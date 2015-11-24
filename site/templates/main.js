import {logo} from './logo';
import {ribon} from './ribon';

export default function template(content) {
	return `
		<html>
			<head>
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<link rel="stylesheet" href="./normalize.css"/>
			<link rel="stylesheet" href="./main.css"/>
			<link rel="stylesheet" href="./logo.css"/>
			<link href='https://fonts.googleapis.com/css?family=Timmana' rel='stylesheet' type='text/css'>
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
						${content}
					</div>
				</div>
			</body>
		</html>
	`
}
