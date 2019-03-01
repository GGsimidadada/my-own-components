const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ["babel-polyfill", path.resolve(__dirname, "src/app.jsx")],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
    },
    resolve: {
		extensions: [".js", ".jsx", ".less", ".css", ".ts", ".tsx"]
	},
    module: {
        rules: [
            {
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [ 
                    { loader: "babel-loader", }
                ]
			},
			{
				test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    { loader: "babel-loader", },
                    { loader: "ts-loader" },
                ]
			},
			{
				test: /\.css$/,
				use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                ],
            },
			{
				test: /\.less$/,
				use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "less-loader" },
                ]
			},
        ]
    },
    devServer: {
        contentBase: './dist',
        open:true,//自动打开浏览器
        port:9000
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        })
    ]
}