import path from 'path';
import webpack from 'webpack';
import objectAssignDeep from 'object-assign-deep';


let commonConfig = {
	entry: [
		path.join(__dirname, '..', 'src', 'haa.js')
	],
	output: {
		path: path.join(__dirname, '..', 'dist'),
		publicPath: '/dist/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
				except: ['Haa']
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

module.exports.amd = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'haa-amd.js',
		libraryTarget: 'amd'
	}
})
module.exports.commonjs = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'haa-commonjs.js',
		libraryTarget: 'commonjs2'
	}
})
module.exports.global = objectAssignDeep({}, commonConfig, {
	output: {
		filename: 'haa-global.js',
    library: ['Haa'],
		libraryTarget: 'var'
	}
})
