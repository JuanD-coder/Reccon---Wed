const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pages = [
    {
        name: 'index', template: './src/pages/index/index.html',
        entry: './src/pages/index/index.js', chunks: ['index']
    },
    {
        name: 'login', template: './src/pages/login/login.html',
        entry: './src/pages/login/login.js', chunks: ['login']
    },
    {
        name: 'home', template: './src/pages/home/home.html',
        entry: './src/pages/home/home.js', chunks: ['navegation-bar', 'reutilizables', 'home',]
    },
    {
        name: 'recoleccion', template: './src/pages/recoleccion/recoleccion.html',
        entry: './src/pages/recoleccion/recoleccion.js', chunks: ['navegation-bar', 'reutilizables', 'recoleccion',]
    },
    {
        name: 'informes', template: './src/pages/informes/informes.html',
        entry: './src/pages/informes/informes.js', chunks: ['navegation-bar', 'reutilizables', 'calendar', 'informes']
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
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
}

module.exports = config

/* Scrits
    "build:dev": "webpack --config ./build/webpack.dev.js",
    "build:pro": "webpack -- config ./build/webpack.prod.js"
*/