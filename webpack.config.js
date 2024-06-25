const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    index: './src/pages/login/index.js',
    home: './src/pages/home/home.js',
    informes: './src/pages/informes/informes.js',
    recoleccion: './src/pages/recoleccion/recoleccion.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
    new MiniCssExtractPlugin({ filename: 'css/[name].css',}),
    new CleanWebpackPlugin(),
  ],
  watch: true
};