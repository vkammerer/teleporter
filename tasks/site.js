import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import marked from 'marked';
import jsBeautify from 'js-beautify';

const siteDirPath = path.join(__dirname, '..', 'site');

export default function site() {
	return new Promise((resolveSite) => {
		const sitePromises = [
			'introduction',
			'installation',
			'api',
			'gotchas',
			'examples'
		].map((p) => {
			return new Promise((resolve) => {
				fs.readFile(path.join(__dirname, '..', 'docs', p + '.md'), 'utf-8', (err, data) => {
					if (!err) {
						resolve(marked(data));
					}
				});
			});
		});

		sitePromises.push(new Promise((resolve) => {
			fs.copy(
				path.join(__dirname, '..', 'dist', 'teleporter-global-polyfilled.js'),
				path.join(siteDirPath, 'static', 'common', 'scripts', 'teleporter-global-polyfilled.js'),
				(err) => {
					if (!err) {
						resolve();
					}
				}
			);
		}));

		sitePromises.push(new Promise((resolve) => {
			fs.copy(
				require.resolve('normalize.css'),
				path.join(siteDirPath, 'static', 'common', 'styles', 'normalize.css'),
				(err) => {
					if (!err) {
						resolve();
					}
				}
			);
		}));

		delete require.cache[require.resolve('../site/templates/index')];
		delete require.cache[require.resolve('../site/templates/schema')];
		delete require.cache[require.resolve('../site/templates/ribon')];
		const indexTemplate = require('../site/templates/index');

		Promise.all(sitePromises).then((siteValues) => {
			const htmlSections = siteValues.slice(0, 5);
			fs.writeFileSync(
				path.join(siteDirPath, 'static', 'index.html'),
				jsBeautify.html(indexTemplate(...htmlSections))
			);
			console.log('Site task complete'.cyan);
			resolveSite();
		});
	});
}
