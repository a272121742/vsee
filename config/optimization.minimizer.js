// const os = require('os');
// const isProd = process.env.NODE_ENV === 'production';
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = config => {
  // isProd
  // && config
  //   .optimization
  //   .minimizer
  //   .use(require.resolve('uglifyjs-webpack-plugin'), [{
  //     parallel: os.cpus().length,
  //     cache: true,
  //     sourceMap: false,
  //     uglifyOptions: {
  //       // 警告：true保留警告，false不保留
  //       warnings: false,
  //       // 打印语句：true去掉，false保留
  //       drop_console: true,
  //       // 内嵌定义了但是只用到一次的变量
  //       collapse_vars: true,
  //       // 提取出出现多次但是没有定义成变量去引用的静态值
  //       reduce_vars: true,
  //       output: {
  //         // 最紧凑的输出
  //         beautify: false,
  //         // 删除所有的注释
  //         comments: false
  //       }
  //     }
  //   }]);
};
