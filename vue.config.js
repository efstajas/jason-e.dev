/* eslint-disable no-param-reassign */
module.exports = {
  configureWebpack: (config) => {
    config.devtool = 'source-map';
  },
  runtimeCompiler: true,
  pwa: {
    themeColor: '#FFFFFF',
  },
};
