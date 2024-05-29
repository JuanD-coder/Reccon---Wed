const { merge } = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = merge(webpackBaseConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        runtimeChunk: 'single',
    },
    watch: true,
});

module.exports = config;

