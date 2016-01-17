import fs from 'fs';
import path from 'path';
import colors from 'colors';
import webpack from 'webpack';
import uglifyJs from 'uglify-js';
import configs from './build.configs';

export default function build() {
	return new Promise((resolve) => {
		const webpackPromises = ['umd', 'globalPolyfilled'].map((exportType) => {
			return new Promise((resolveWebpack) => {
				webpack(configs[exportType]).run((err) => {
					if (!err) {
						resolveWebpack();
					}
				});
			});
		});

		Promise.all(webpackPromises).then(() => {
			const globalWithPollyfills = uglifyJs.minify([
				require.resolve('es6-promise').replace('.js', '.min.js'),
				require.resolve('web-animations-js'),
				path.join(__dirname, '..', 'dist', 'teleporter-global-polyfilled.js')
			]).code;
			fs.writeFile(path.join(
				__dirname, '..', 'dist', 'teleporter-global-polyfilled.js'),
				globalWithPollyfills, () => {
					console.log('Build task complete'.cyan);
					resolve();
				});
		});
	});
}
