import path from 'path';
import webpack from 'webpack';
import objectAssignDeep from 'object-assign-deep';

let commonConfig = {
	entry: [
		path.join(__dirname, '..', 'src', 'teleporter.js')
	],
	output: {
		path: path.join(__dirname, '..', 'dist'),
		publicPath: '/dist/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
				except: ['Teleporter']
			}
		})
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel'
			}
		]
	}
}

module.exports.umd = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'teleporter.js',
		libraryTarget: 'umd'
	}
})

let globalConfig = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'teleporter-global.js',
    library: ['Teleporter'],
		libraryTarget: 'var'
	}
})
module.exports.global = globalConfig;

let globalPolyfilledConfig = objectAssignDeep({}, globalConfig, {
	output: {
		filename: 'teleporter-global-polyfilled.js'
	}
})
globalPolyfilledConfig.plugins.push(
	new webpack.ProvidePlugin({
		'Object.assign': 'object-assign'
	})
)

module.exports.globalPolyfilled = globalPolyfilledConfig;
