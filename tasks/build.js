import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import uglifyJs from 'uglify-js';
import configs from './configs';

['global', 'commonjs', 'amd'].forEach((exportType) => {
	webpack(configs[exportType]).run((err, stats) => {});
})

let globalWithPollyfills = uglifyJs.minify([
	require.resolve('es6-promise').replace('.js', '.min.js'),
	require.resolve('web-animations-js'),
	path.join(__dirname, '..', 'dist', 'haa-global.js')
]).code;

fs.writeFileSync(path.join(__dirname, '..', 'dist', 'haa-global-pollyfilled.js'), globalWithPollyfills);
