const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');




const webpackConfig = {
	entry: './src/index.js',
	output: {
		// output: {
  //   path: config.build.assetsRoot,
  //   filename: '[name].js',
  //   publicPath: process.env.NODE_ENV === 'production'
  //     ? config.build.assetsPublicPath
     
		path: '/',
		// filename: '[name].js',
		filename: 'bundle.js',
		// publicPath: './'
		// putli
	},
	mode: 'development',
	devServer: {
		quiet: true, // FriendlyErrorsPlugin
	},
	module: {
		rules: [{
			test: /\.less$/,
			loaders: ['style-loader', 'css-loader', 'less-loader'],
		}, {
			test: /\.js$/,
      loader: 'babel-loader',
		}]
	},
	plugins: [
		// new FriendlyErrorsPlugin({
		// 	compilationSuccessInfo: {
  //       messages: [`Your application is running here: `],
  //     },
		// }),
	]
}

module.exports = new Promise((resolve, reject) => {
	console.log('sucessed');

	webpackConfig.plugins.push(new FriendlyErrorsPlugin({
		compilationSuccessInfo: {
      messages: [`Your application is running here: localhost: port`],
    },
	}));
	resolve(webpackConfig);
});