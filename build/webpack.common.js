const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const pages = [
    {
        name: 'index', template: './src/pages/login/index.html',
        entry: './src/pages/login/index.js', chunks: ['index', 'navegation-bar']
    },
    {
        name: 'user-home', template: './src/pages/home/user-home.html',
        entry: './src/pages/home/user-home.js', chunks: ['user-home', 'navegation-bar']
    },
    {
        name: 'informes', template: './src/pages/informes/informes.html',
        entry: './src/pages/informes/informes.js', chunks: ['informes', 'navegation-bar', 'reutilizables', 'calendar']
    },
    {
        name: 'recoleccion', template: './src/pages/recoleccion/recoleccion.html',
        entry: './src/pages/recoleccion/recoleccion.js', chunks: ['recoleccion', 'navegation-bar', 'reutilizables']
    },
];

const htmlPlugins = pages.map(page => {
    return new HtmlWebpackPlugin({
        template: page.template,
        filename: `${page.name}.html`,
        chunks: page.chunks,
        inject: 'body',
        minify: {
            removeComments: true,
            /* collapseWhitespace: true, */
            removeAttributeQuotes: true,
            removeRedundantAttributes: true
        },
    });
});

const config = {
    entry: Object.fromEntries(pages.map(page => [page.name, page.entry])),
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: './',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]',
                },
                /* use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images/',
                        },
                    },
                ], */
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name].[contenthash:7][ext]',
                },
            },
        ]
    },
    plugins: [
        ...htmlPlugins,
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
}

module.exports = config