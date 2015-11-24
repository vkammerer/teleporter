import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import uglifyJs from 'uglify-js';
import configs from './build.configs';

let webpackPromises = ['umd', 'global'].map((exportType) => {
	return new Promise((resolve, reject) => {
		webpack(configs[exportType]).run((err, stats) => {
			if (!err) {
				resolve()
			}
		});
	})
})

Promise.all(webpackPromises).then(()=>{
	let globalWithPollyfills = uglifyJs.minify([
		require.resolve('es6-promise').replace('.js', '.min.js'),
		require.resolve('web-animations-js'),
		path.join(__dirname, '..', 'dist', 'teleporter-global.js')
	]).code;
	fs.writeFileSync(path.join(__dirname, '..', 'dist', 'teleporter-global-polyfilled.js'), globalWithPollyfills);
})

// export default const build = () => {
// 	return new Promise((resolve, reject) => {
// resolve();
// 	})
// })
