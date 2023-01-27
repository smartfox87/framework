const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {ProvidePlugin} = require('webpack');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

const htmlPageNames = glob.sync('./local/source/pages/*.pug', {})
const multipleHtmlPlugins = htmlPageNames.map(name => {
	return new HtmlWebpackPlugin({
		template: name, // relative path to the HTML files
		filename: name.replace('./local/source/pages/', '').replace(/(pug)$/, 'html'), // output HTML files
		chunks: [`assets`]// respective JS files
	})
});

const PATHS = {
	src() {
		const pluginsGlobPath = glob.sync('./local/source/js/plugins/**/*.js', {})
		const blocksGlobPath = glob.sync('./local/source/blocks/**/*.js', {})
		return [].concat(pluginsGlobPath).concat(blocksGlobPath).concat(['./local/source/js/script.js', './local/source/scss/style.scss'])
	},
	dist: '/local/dist'
}

module.exports = (env, options) => {
	const isDevelopment = options.mode !== 'production';

	return {
		entry: {
			assets: PATHS.src()
		},
		output: {
			path: __dirname + PATHS.dist,
			filename: 'js/script.js',
		},
		devServer: {
			compress: true,
			port: 8010,
			hot: true,
			host: '192.168.31.10',
			open: true,
			watchFiles: ['./local/source/**/*']
		},
		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {
									useBuiltIns: 'usage',
									corejs: {
										version: 3,
										proposals: true
									}
								}],
							],
						}
					}
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						// fallback to style-loader in development
						MiniCssExtractPlugin.loader,
						// Translates CSS into CommonJS
						'css-loader',
						// Compiles Sass to CSS
						'sass-loader',
					],
				},
				{
					test: /\.pug$/,
					use: {
						loader: 'pug-loader',
					}
				},
				{
					test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
					use: {
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts',
							publicPath: '../fonts',
						}
					}
				},
				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					use: {
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'img',
							publicPath: '../img',
						},
					}
				},
			],
		},
		resolve: {
			extensions: ['.js']
		},
		optimization: {
			minimize: !isDevelopment,
		},
		watch: true,
		plugins: [
			new CleanWebpackPlugin(),
			new ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.$': 'jquery',
				'window.jQuery': 'jquery'
			}),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: 'css/style.css',
			}),
			new CopyPlugin({
				patterns: [
					{from: './local/source/img', to: 'img'},
					{from: './local/source/ajax', to: 'ajax'},
				]
			}),
			new HtmlWebpackPugPlugin()
		].concat(multipleHtmlPlugins),
	}
};