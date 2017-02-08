var pkg = require('../package.json');

// the 'require' parameter is in the context of front-cli, not the application
module.exports = function(require) {
	var path = require('path');
	var webpack = require('webpack');
	var ExtractTextPlugin = require('extract-text-webpack-plugin');
	var HtmlWebpackPlugin = require('html-webpack-plugin');
	var PurifyCSSPlugin = require('purifycss-webpack');
	var glob = require('glob');
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
			filename: 'js/[name]-[chunkhash].js'
		},

		module: {
			rules: [
				{
					test: /\.vue$/i,
					loader: 'vue-loader',
					options: {
						loaders: {
							js: 'babel-loader?' + JSON.stringify(babelOptions),
							css: ExtractTextPlugin.extract({
								use: {
									loader: 'css-loader',
									options: {
										sourceMap: true
									}
								},
								publicPath: '../'
							})
						}
					}
				},
				{
					test: /\.tpl$/i,
					loader: 'handlebars-template-loader'
				},
				{
					test: /\.(js|vue)$/i,
					loader: 'eslint-loader',
					enforce: 'pre',
					exclude: /node_modules/,
					options: {
						fix: true
					}
				},
				{
					test: /\.js$/i,
					loader: 'babel-loader?' + JSON.stringify(babelOptions),
					exclude: /node_modules/
				},
				{
					test: /\.css$/i,
					loader: ExtractTextPlugin.extract({
						use: {
							loader: 'css-loader',
							options: {
								sourceMap: true
							}
						},
						publicPath: '../'
					})
				},
				{
					test: /\.(eot|woff2?|ttf|svg|png|jpg|gif|bmp)(\?.*)*$/i,
					loader: 'file-loader',
					options: {
						name: 'img/[name]-[hash].[ext]'
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
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production')
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'libs',
				minChunks: function (module) {
					return module.context && module.context.indexOf('node_modules') !== -1;
				}
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest',
				minChunks: Infinity
			}),
			new webpack.optimize.UglifyJsPlugin({
				output: { comments: false },
				sourceMap: true
			}),
			new ExtractTextPlugin({
				filename: 'css/application-[chunkhash].css',
				allChunks: true
			}),
			new PurifyCSSPlugin({
				paths: glob.sync(path.join(__dirname, '../**/*.{htm,html,vue,tpl}')),
				minimize: true
			}),
			new webpack.BannerPlugin({
				banner: [
					pkg.name +  ' ' + pkg.version + ' - ' + pkg.description,
					'\nDevelopers:\n',
					pkg.authors.map(function(a) { return '\t\t' + a;}).join('\n')
				].join('\n'),
				entryOnly: true
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: 'index.html',
				favicon: 'favicon.ico'
			})
		],

		devtool: '#source-map'
	};
};

// var pkg = require('../package.json');

// // the 'require' parameter is in the context of front-cli, not the application
// module.exports = function(require) {
// 	var path = require('path');
// 	var webpack = require('webpack');
// 	var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 	var HtmlWebpackPlugin = require('html-webpack-plugin');

// 	return {
// 		entry: [
// 			path.resolve(__dirname, '../application/main.js')
// 		],

// 		output: {
// 			path: path.resolve(__dirname, '../dist'),
// 			filename: 'js/application-[hash].js'
// 		},

// 		module: {
// 			loaders: [
// 				{
// 					test: /\.js$/i,
// 					loaders: ['babel-loader', 'eslint-loader'],
// 					exclude: /node_modules/
// 				},
// 				{
// 					test: /\.tpl$/i,
// 					loader: 'handlebars-template-loader'
// 				},
// 				{
// 					test: /\.css$/i,
// 					loader: ExtractTextPlugin.extract(['css-loader'], { publicPath: '../../' })
// 				},
// 				{
// 					test: /\.(eot|woff2?|ttf|svg|png|jpg|gif|bmp)(\?.*)*$/i,
// 					loader: 'file-loader',
// 					query: {
// 						name: 'assets/img/[name].[ext]'
// 					}
// 				},
// 				{
// 					test: /\.json$/,
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
// 			new webpack.DefinePlugin({
// 				'process.env': {
// 					NODE_ENV: JSON.stringify('production'),
// 					BABEL_ENV: JSON.stringify('production')
// 				}
// 			}),
// 			new webpack.optimize.UglifyJsPlugin({
// 				compress: { warnings: false },
// 				output: { comments: false }
// 			}),
// 			new webpack.BannerPlugin([
// 				pkg.name +  ' ' + pkg.version + ' - ' + pkg.description,
// 				'\nDevelopers:\n',
// 				pkg.authors.map(function(a) { return '\t' + a;}).join('\n')
// 			].join('\n'), { entryOnly: true }),
// 			new ExtractTextPlugin('assets/css/application-[hash].css', { allChunks: true }),
// 			new HtmlWebpackPlugin({
// 				filename: 'index.html',
// 				template: 'index.html',
// 				favicon: 'favicon.ico'
// 			})
// 		]
// 	};
// };