var webpack = require('webpack');
var commonPlugin = new webpack.optimizae.commonPlugin('common.js');

module.exports = {
  // 插件项;
  plugins: [commonPlugin],
  // 页面入口文件配置;
  entry: {
    index: 'index.js'
  },
  loaders: [{
    loader: 'babel',
    query: {
      plugins: ['transform-runtime'],
      presets: [
        ["env", {
          "module": false,
          "loose": true,
        }],
      ],
    },
  }],
}