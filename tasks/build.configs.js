import path from 'path';
import webpack from 'webpack';
import objectAssignDeep from 'object-assign-deep';

const commonConfig = {
	devtool: 'source-map',
	entry: [
		path.join(__dirname, '..', 'src', 'teleporter.js')
	],
	output: {
		path: path.join(__dirname, '..', 'dist'),
		library: 'Teleporter',
		libraryTarget: 'umd',
		umdNamedDefine: true,
		publicPath: '/dist/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'stage-0'],
					plugins: ['babel-plugin-add-module-exports']
				},
			},
		]
	}
};

const umdConfig = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'teleporter.js',
	}
});

const globalPolyfilledConfig = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'teleporter-global-polyfilled.js'
	}
});

globalPolyfilledConfig.module.loaders[0].query.plugins.push('transform-object-assign');

module.exports = {
	umd: umdConfig,
	globalPolyfilled: globalPolyfilledConfig
};
