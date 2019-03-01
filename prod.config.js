const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    entry: './src/app.jsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        libraryTarget: 'commonjs2'
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
				loader: ["babel-loader", "ts-loader"]
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
    externals: [ nodeExternals() ]
}