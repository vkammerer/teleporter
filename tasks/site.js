import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import marked from 'marked';
import jsBeautify from 'js-beautify';

let siteDirPath = path.join(__dirname, '..', 'site');

export default function site() {
	return new Promise((resolve, reject) => {

		let htmlSections = [
			'introduction',
			'installation',
			'api',
			'license'
		].map((p) => {
			let markdownContent = fs.readFileSync(path.join(__dirname, '..', 'docs', p + '.md'), 'utf-8');
			return marked(markdownContent)
		})

		delete require.cache[require.resolve('../site/templates/index')]
		let indexTemplate = require('../site/templates/index').default;

		fs.writeFileSync(
			path.join(siteDirPath, 'static', 'index.html'),
			jsBeautify.html(indexTemplate(...htmlSections))
		);

		fs.copySync(
			path.join(__dirname, '..', 'dist', 'teleporter-global-polyfilled.js'),
			path.join(siteDirPath, 'static', 'teleporter-global-polyfilled.js')
		);

		fs.copySync(
			require.resolve('normalize.css'),
			path.join(siteDirPath, 'static', 'normalize.css')
		);

		console.log('Site task complete'.cyan)
		resolve()

	})
}
