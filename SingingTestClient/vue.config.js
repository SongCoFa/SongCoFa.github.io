
const defaultSettings = require('./src/settings.js');

const name = defaultSettings.title || 'Management System';

module.exports = {
  publicPath: '/SingingTestClient/',
  configureWebpack: {
    devtool: 'source-map',
    name,
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.184:610/SingingTestAPI/',
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
