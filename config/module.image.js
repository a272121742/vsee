module.exports = (config) => {
  // TODO: 除去图片之外的可能要用url-loader进行压缩了
  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .use('image-webpack-loader')
    .loader('image-webpack-loader')
    .options({
      bypassOnDebug: true,
    })
    .end();
};
