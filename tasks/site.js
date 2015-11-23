import fs from 'fs-extra';
import path from 'path';
import marked from 'marked';
import jsBeautify from 'js-beautify';
import mainTemplate from '../site/templates/main';

let siteDirPath = path.join(__dirname, '..', 'site');

let readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf-8');
fs.writeFileSync(path.join(siteDirPath, 'static', 'index.html'), jsBeautify.html(mainTemplate(marked(readme))));

fs.copySync(
	path.join(__dirname, '..', 'dist', 'haa-global-pollyfilled.js'),
	path.join(siteDirPath, 'static', 'haa-global-pollyfilled.js')
);

fs.copySync(
	require.resolve('normalize.css'),
	path.join(siteDirPath, 'static', 'normalize.css')
);
