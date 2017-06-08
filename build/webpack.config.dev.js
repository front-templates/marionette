// the 'require' parameter is in the context of front-cli, not the application
module.exports = require => {
	var path = require('path');
	var webpack = require('webpack');
	var HtmlWebpackPlugin = require('html-webpack-plugin');
	var babelOptions = {
		presets: [
			[require.resolve('babel-preset-env'), {
				targets: {
					browsers: ['ie >= 11']
				},
				modules: false,
				useBuiltIns: true,
				debug: false
			}]
		]
	};

	return {
		entry: {
			application: [
				'webpack-dev-server/client?{{host}}:{{port}}',
				'webpack/hot/dev-server',
				path.resolve(__dirname, '../application/main.js')
			]
		},

		output: {
			path: path.resolve(__dirname, '../dist'),
			filename: '[name].js',
			chunkFilename: '[name].js'
		},

		module: {
			rules: [
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
			extensions: ['.js', '.tpl']
		},

		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'application',
				children: true,
				minChunks: 2
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'libs',
				minChunks({ context }) {
					return context && context.indexOf('node_modules') >= 0;
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
			overlay: true,

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