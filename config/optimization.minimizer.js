const isProd = process.env.NODE_ENV === 'production';
const unzip = !!process.env.npm_config_unzip;

module.exports = (config) => {
  isProd
    && !unzip
    && config.optimization.runtimeChunk({ name: 'manifest' }).minimizer('terser').tap((args) => {
      console.log('\n压缩代码中...');
      Object.assign(args[0].terserOptions.compress, {
        // 警告：true保留警告，false不保留
        warnings: false,
        // 打印语句：true去掉，false保留
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
        // 删除以下api
        pure_funcs: ['console.log'],
      });
      return args;
    })
    && config.plugin('html').tap((args) => {
      args[0].minify.useShortDoctype = true;
      args[0].minify.removeEmptyAttributes = true;
      args[0].minify.removeRedundantAttributes = true;
      args[0].minify.keepClosingSlash = true;
      args[0].minify.minifyJS = true;
      args[0].minify.minifyCSS = true;
      args[0].minify.minifyURLs = true;
      return args;
    });
};
