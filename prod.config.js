const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    entry: ["babel-polyfill", path.resolve(__dirname, "./src/index.js")],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        libraryTarget: 'commonjs2'
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