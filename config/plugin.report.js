const report = !!process.env.npm_config_report;

module.exports = (config) => {
  if (report) {
    config
      .plugin('report')
      // eslint-disable-next-line global-require
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
      .end();
  }
};
