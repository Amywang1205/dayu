var webpack = require('webpack'),
//代码压缩插件
UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
	compress : false,
	mangle : false,
	mangle_props : false
});

module.exports = {
	//插件项
	plugins: [UglifyJsPlugin],
	//入口文件配置
    	entry: {
		idnex : './source/js/index.js',
		comments : './source/js/comments.js',
		infos : './source/js/infos.js',
		sign : './source/js/sign.js'
    	},
    	//输出文件配置
   	output: {
        	path: './source/js',
        	filename: '[name].min.js'
    	},
	module: {
		//es6转es5
		loaders: [
		{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}
		  ]
	}
};
