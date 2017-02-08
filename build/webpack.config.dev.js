// the 'require' parameter is in the context of front-cli, not the application
module.exports = function (require) {
	var path = require('path');
	var webpack = require('webpack');
	var HtmlWebpackPlugin = require('html-webpack-plugin');
	var babelOptions = {
		presets: [
			[require.resolve('babel-preset-env'), {
				targets: {
					browsers: ['ie>8']
				},
				modules: false,
				debug: false
			}]
		],

		compact: true
	};

	return {
		entry: {
			application: [path.resolve(__dirname, '../application/main.js')]
		},
		
		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: '[name].js'
		},

		module: {
			rules: [
				{
					test: /\.vue$/i,
					loader: 'vue-loader'
				},
				{
					test: /\.tpl$/i,
					loader: 'handlebars-template-loader'
				},
				{
					test: /\.js$/i,
					loader: 'babel-loader?' + JSON.stringify(babelOptions),
					exclude: /node_modules/
				},
				{
					test: /\.css$/i,
					use: [
						{
							loader: 'style-loader'
						},
						{
							loader: 'css-loader'
						}
					]
				},
				{
					test: /\.(eot|woff2?|ttf|svg|png|jpg|gif|bmp)(\?.*)*$/i,
					loader: 'file-loader',
					options: {
						name: 'assets/img/[name].[ext]'
					}
				}
			]
		},

		resolve: {
			modules: [
				path.resolve(__dirname, '../'),
				path.resolve(__dirname, '../application'),
				path.resolve(__dirname, '../node_modules')
			],
			extensions: ['.js', '.vue', '.tpl']
		},

		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				name: 'libs',
				minChunks: function (module) {
					return module.context && module.context.indexOf('node_modules') !== -1;
				}
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: 'index.html',
				favicon: 'favicon.ico'
			})
		],

		devtool: '#module-eval-source-map',

		devServer: {
			hot: true,
			quiet: true,
			clientLogLevel: 'error',

			// uncomment the following lines to enable proxy

			// proxy: {
			// 	'/api': {
			// 		target: 'http://PROXY_URL',
			// 		changeOrigin: true,
			// 		pathRewrite: {'^/api' : ''},
			// 		logLevel: 'error'
			// 	}
			// }
		}
	};
};

// the 'require' parameter is in the context of front-cli, not the application
// module.exports = function(require) {
// 	var path = require('path');
// 	var HtmlWebpackPlugin = require('html-webpack-plugin');

// 	return {
// 		entry: [
// 			path.resolve(__dirname, '../application/main.js')
// 		],

// 		output: {
// 			path: path.resolve(__dirname, '../dist'),
// 			filename: 'application-[hash].js'
// 		},

// 		module: {
// 			loaders: [
// 				{
// 					test: /\.js$/i,
// 					loader: 'babel-loader',
// 					exclude: /node_modules/
// 				},
// 				{
// 					test: /\.tpl$/i,
// 					loader: 'handlebars-template-loader'
// 				},
// 				{
// 					test: /\.css$/i,
// 					loaders: ['style-loader', 'css-loader']
// 				},
// 				{
// 					test: /\.(eot|woff2?|ttf|svg|png|jpg|gif|bmp)(\?.*)*$/i,
// 					loader: 'file-loader',
// 					query: {
// 						name: 'assets/img/[name].[ext]'
// 					}
// 				},
// 				{
// 					test: /\.json$/i,
// 					loader: 'json-loader',
// 					exclude: /node_modules/
// 				}
// 			]
// 		},

// 		babel: {
// 			presets: [require.resolve('babel-preset-es2015')],
// 			plugins: [require.resolve('babel-plugin-transform-runtime')],
// 			compact: true
// 		},

// 		resolve: {
// 			root: [
// 				path.resolve(__dirname, '../'),
// 				path.resolve(__dirname, '../application'),
// 				path.resolve(__dirname, '../node_modules')
// 			],
// 			extensions: ['', '.js', '.vue']
// 		},

// 		plugins: [
// 			new HtmlWebpackPlugin({
// 				filename: 'index.html',
// 				template: 'index.html',
// 				favicon: 'favicon.ico'
// 			})
// 		],

// 		devtool: 'cheap-module-eval-source-map',

// 		devServer: {
// 			hot: true,
// 			quiet: true,
// 			clientLogLevel: 'error',

// 			// uncomment the following lines to enable proxy

// 			// proxy: {
// 			// 	'/api': {
// 			// 		target: 'http://PROXY_URL',
// 			// 		changeOrigin: true,
// 			// 		pathRewrite: {'^/api' : ''},
// 			// 		logLevel: 'error'
// 			// 	}
// 			// }
// 		}
// 	};
// };