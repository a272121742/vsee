module.exports = (config) => {
  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    .use('file-loader')
    .loader('image-webpack-loader')
    .options({
      bypassOnDebug: true,
      disable: process.env.NODE_ENV !== 'production',
    })
    .end();
};
