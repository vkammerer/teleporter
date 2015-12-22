import path from 'path';
import webpack from 'webpack';
import objectAssignDeep from 'object-assign-deep';

let commonConfig = {
	entry: [
		path.join(__dirname, '..', 'src', 'common.js')
	],
	output: {
		path: path.join(__dirname, '..', 'dist'),
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
					presets: ['es2015', 'stage-0']
				},
			},
		]
	}
}

let umdConfig = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'teleporter.js',
		libraryTarget: 'umd'
	}
})

let globalConfig = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'teleporter-global.js',
    library: 'Teleporter',
		libraryTarget: 'var'
	}
})

let globalPolyfilledConfig = objectAssignDeep({}, globalConfig, {
	output: {
		filename: 'teleporter-global-polyfilled.js'
	}
})

globalPolyfilledConfig.module.loaders[0].query.plugins = ['transform-object-assign'];

module.exports = {
	umd: umdConfig,
	global: globalConfig,
	globalPolyfilled: globalPolyfilledConfig
}
