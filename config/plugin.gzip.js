const needGzip = !!process.env.npm_config_gzip;

module.exports = (config) => {
  if (needGzip) {
    config
      .plugin('gzip')
      .use('compression-webpack-plugin', [{
        filename: '[path].gz[query]', // 2.x.x 改为此属性
        algorithm: 'gzip',
        // algorithm: 'brotliCompress',
        test: /\.(js|css|svg|woff|otf|ttf|json|png)$/,
        compressionOptions: { level: 9 },
        threshold: 10240,
        minRatio: 1,
        deleteOriginalAssets: true, // 删除原文件
      }])
      .end();
  }
};
