const glob = require('glob')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let htmlPageNames = ['dynamic-blocks', 'dynamic-form', 'dynamic-media', 'index', 'static'];
let multipleHtmlPlugins = htmlPageNames.map(name => {
	return new HtmlWebpackPlugin({
		template: `./local/source/pages/${name}.pug`, // relative path to the HTML files
		filename: `${name}.html`, // output HTML files
		chunks: [`script`]// respective JS files
	})
});

const PATHS = {
	src() {
		const pluginsGlobPath = glob.sync('./local/source/js/plugins/**/*.js', {})
		const blocksGlobPath = glob.sync('./local/source/blocks/**/*.js', {})
		const result = ['core-js/stable']
			.concat(pluginsGlobPath)
			.concat(blocksGlobPath)
			.concat(['./local/source/js/script.js', './local/source/scss/style.scss'])
		return result
	},
	dist: '/local/dist'
}

module.exports = (env, options) => {
	const isDevelopment = options.mode !== 'production';

	return {
		entry: {
			script: PATHS.src()
		},
		output: {
			path: __dirname + PATHS.dist,
			filename: 'js/script.js',
			environment: {
				// The environment supports arrow functions ('() => { ... }').
				arrowFunction: false,
				// The environment supports BigInt as literal (123n).
				bigIntLiteral: false,
				// The environment supports const and let for variable declarations.
				const: false,
				// The environment supports destructuring ('{ a, b } = obj').
				destructuring: false,
				// The environment supports an async import() function to import EcmaScript modules.
				dynamicImport: false,
				// The environment supports 'for of' iteration ('for (const x of array) { ... }').
				forOf: false,
				// The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
				module: false,
			},
		},
		devServer: {
			contentBase: PATHS.dist,
			compress: true,
			port: 9000,
			stats: 'errors-only'
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
									},
									targets: [
										'last 5 versions',
										'ie >= 11'
									]
								}],
							],
							plugins: [
								['@babel/plugin-proposal-decorators', {decoratorsBeforeExport: true}],
								['@babel/plugin-proposal-class-properties', {'loose': true}]
							]
						}
					}
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						// fallback to style-loader in development
						isDevelopment ? 'style-loader' : {
							loader: MiniCssExtractPlugin.loader,
							options: {
								publicPath: PATHS.dist,
							},
						},
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
							publicPath: PATHS.dist + '/fonts',
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
							publicPath: PATHS.dist + '/img',
						},
					}
				},
				{test: /\.(png|jpe?g|gif|svg)$/, use: ['url-loader?limit=100000']}
			],
		},
		resolve: {
			extensions: ['.js']
		},
		optimization: {
			minimize: !isDevelopment,
		},
		plugins: [
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: 'css/style.css',
			}),
			new CopyPlugin([
				{from: './local/source/img', to: './local/dist/img'},
			]),
		].concat(multipleHtmlPlugins),
	}
};