const path = require('path');

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
  watch: true
};