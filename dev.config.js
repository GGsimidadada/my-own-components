const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
// 这个插件使webpack打包的组件中不包括任何node_modules里面的第三方组件
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    entry: ["babel-polyfill", path.resolve(__dirname, "example/app.jsx")],
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
                    { 
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [ tsImportPluginFactory({
                                    libraryName: 'antd',
                                    libraryDirectory: 'lib',
                                    style: 'css'
                                }) ],
                            }),
                            compilerOptions: {
                                module: 'es2015'
                            }
                        }
                    },
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
            template: path.resolve(__dirname, './example/index.html'),
        })
    ],
    externals: [ nodeExternals() ]
}