var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')
const mode = process.env.MODE || 'production'
const webpack = require('webpack')

module.exports = {
    entry: './src/index',
    mode,
    optimization: { minimize: mode === 'production' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.scss']
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        }, {
            test: /\.(scss|css)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        esModule: true,
                        filename: '[name].css',
                        chunkFilename: '[name].css'
                    }
                },
                'css-loader',
                'sass-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.html$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }
            ]
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({ options: { postcss: [autoprefixer()] } }),
        new MiniCssExtractPlugin()
    ],
};