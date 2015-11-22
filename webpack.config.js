import path from 'path';
import webpack from 'webpack';

module.exports = {
	entry: [
		path.join(__dirname, 'src', 'Flipper.js')
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'flipper.js',
		publicPath: '/dist/',
    library: ['Flipper']
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
				except: ['Flipper']
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
