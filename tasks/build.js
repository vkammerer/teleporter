import fs from 'fs';
import path from 'path';
import colors from 'colors';
import webpack from 'webpack';
import uglifyJs from 'uglify-js';
import configs from './build.configs';

export default function build() {
	return new Promise((resolve, reject) => {
		let webpackPromises = ['umd', 'global', 'globalPolyfilled'].map((exportType) => {
			return new Promise((resolveWebpack, reject) => {
				webpack(configs[exportType]).run((err, stats) => {
					resolveWebpack()
				});
			})
		})


		Promise.all(webpackPromises).then(()=>{
			let globalWithPollyfills = uglifyJs.minify([
				require.resolve('es6-promise').replace('.js', '.min.js'),
				require.resolve('web-animations-js'),
				path.join(__dirname, '..', 'dist', 'teleporter-global-polyfilled.js')
			]).code;
			fs.writeFile(path.join(__dirname, '..', 'dist', 'teleporter-global-polyfilled.js'), globalWithPollyfills, () => {
				console.log('Build task complete'.cyan)
				resolve()
			});
		})

	})
}
