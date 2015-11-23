import fs from 'fs-extra';
import path from 'path';
import marked from 'marked';
import mainTemplate from './templates/main';

let readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'static', 'index.html'), mainTemplate(marked(readme)));


fs.copySync(
	path.join(__dirname, '..', 'dist', 'haa-global.js'),
	path.join(__dirname, 'static', 'haa-global.js')
);

fs.copySync(
	require.resolve('normalize.css'),
	path.join(__dirname, 'static', 'normalize.css')
);

