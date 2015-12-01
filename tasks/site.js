import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import marked from 'marked';
import jsBeautify from 'js-beautify';

let siteDirPath = path.join(__dirname, '..', 'site');

export default function site() {
	return new Promise((resolveSite, rejectSite) => {

		let sitePromises = [
			'introduction',
			'installation',
			'api',
			'examples'
		].map((p) => {
			return new Promise((resolve, reject) => {
				fs.readFile(path.join(__dirname, '..', 'docs', p + '.md'), 'utf-8', (err, data) => {
					if (!err) {
						resolve(marked(data))
					}
				});
			})
		})

		sitePromises.push(new Promise((resolve, reject) => {
			fs.copy(
				path.join(__dirname, '..', 'dist', 'teleporter-global-polyfilled.js'),
				path.join(siteDirPath, 'static', 'scripts', 'teleporter-global-polyfilled.js'),
				(err, data) => {
					if (!err) {
						resolve()
					}
				}
			);
		}))

		sitePromises.push(new Promise((resolve, reject) => {
			fs.copy(
				require.resolve('normalize.css'),
				path.join(siteDirPath, 'static', 'styles', 'normalize.css'),
				(err, data) => {
					if (!err) {
						resolve()
					}
				}
			);
		}))

		delete require.cache[require.resolve('../site/templates/index')]
		delete require.cache[require.resolve('../site/templates/schema')]
		delete require.cache[require.resolve('../site/templates/ribon')]
		let indexTemplate = require('../site/templates/index').default;

		Promise.all(sitePromises).then((siteValues) => {

			let htmlSections = siteValues.slice(0, 4);

			fs.writeFileSync(
				path.join(siteDirPath, 'static', 'index.html'),
				jsBeautify.html(indexTemplate(...htmlSections))
			);

			console.log('Site task complete'.cyan)
			resolveSite()

		})
	})
}
