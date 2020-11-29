const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        'walletconnect': ["ethers", "@walletconnect/client", "@walletconnect/qrcode-modal", "@walletconnect/web3-provider"],
        index: { import: ["./src/index.js", "./src/styles.less"], dependOn: "walletconnect" },
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            "crypto": "crypto-browserify",
            "stream": "stream-browserify",
            "buffer": 'buffer',
            "util": "util",
            "assert": "assert",
            "os": "os-browserify",
            "https": "https-browserify",
            "http": "http-browserify",
        }
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/, // .less and .css
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "DAPP-Demo",
            hash: true,
            template: "index.html"
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser'
        }),
    ],
    devServer: {
        watchContentBase: true,
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000,
        watchOptions: {
            poll: true
        }
    }
}