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
module.exports.global = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'teleporter-global.js',
    library: ['Teleporter'],
		libraryTarget: 'var'
	}
})
