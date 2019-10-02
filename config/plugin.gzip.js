const needGzip = !!process.env.npm_config_gzip;

module.exports = config => {
  if (needGzip) {
    config
      .plugin('gzip')
      .use('compression-webpack-plugin', [{
        filename: '[path].gz[query]', // 2.x.x 改为此属性
        algorithm: 'gzip',
        test: /\.(js|css|html|svg|woff|otf|ttf|json)$/,
        threshold: 0,
        minRatio: 0.8,
        deleteOriginalAssets: true// 删除原文件
      }])
      .end();
  }
};
