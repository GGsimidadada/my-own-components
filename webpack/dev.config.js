const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: "../src/app.jsx",
    output: {
        filename: 'bundle.js',
        path: '../dist',
    },
    resolve: {
		extensions: [".js", ".jsx", ".less", ".css", ".ts", ".tsx"]
	},
    module: {
        rules: [
            {
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				loader: "ts-loader"
			},
			{
				test: /\.css$/,
				use: [ "style-loader", "css-loader" ]  //将css文件从js中分离出来
			},
			{
				test: /\.less$/,
				use: ["style-loader", "css-loader", "less-loader"] //把less文件转换成css文件，并从js中分离出来
			},
        ]
    },
    devServer: {
        contentBase: './dist',
    },
    plugins: [
        new htmlWebpackPlugin({
            template: '../src/index.html',
        })
    ]
}