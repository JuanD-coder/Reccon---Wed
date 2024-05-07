const path = require('path');
/* const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); */

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    index: './src/pages/login/index.js',
    home: './src/pages/home/user-home.js',
    informes: './src/pages/informes/informes.js',
    recoleccion: './src/pages/recoleccion/recoleccion.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  /* optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // Aprovechar el paralelismo para una compilación más rápida
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    }
  }, */
  watch: true
};