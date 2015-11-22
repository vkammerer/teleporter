import path from 'path';
import webpack from 'webpack';

module.exports = {
	entry: [
		path.join(__dirname, 'src', 'haa.js')
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'haa-global.js',
		publicPath: '/dist/',
    library: ['Haa']
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
				exclude: ['node_modules'],
				loader: 'babel'
			}
		]
	}
};
