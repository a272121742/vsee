const isProd = process.env.NODE_ENV === 'production';

module.exports = config => {
  isProd &&
    config.optimization.splitChunks({
      chunks: 'all',
      maxAsyncRequests: 5, // 按需加载时候最大的并行请求数
      maxInitialRequests: Infinity, // 最大初始化请求数
      minSize: 819200, // 依赖包超过100kb将被单独打包，默认值：300000
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /node_modules/,
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 10,
          name (module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `chunk.${packageName.replace('@', '')}`;
          }
        },
        common: {
          chunks: 'all',
          test: /\.(vue|js)$/,
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 60
        },
        styles: {
          name: 'styles',
          test: /\.(le|c)ss$/,
          chunks: 'all',
          enforce: true
        },
        runtimeChunk: {
          name: 'manifest'
        }
      }
      //   chunks: 'all', // initial、async和all
      //   minSize: 204800, // 形成一个新代码块最小的体积
      //   maxAsyncRequests: 5, // 按需加载时候最大的并行请求数
      //   maxInitialRequests: 3, // 最大初始化请求数
      //   automaticNameDelimiter: '~', // 打包分割符
      //   name: true,
      //   // cacheGroups: {
      //   //   vendors: { // 项目基本框架等
      //   //     chunks: 'all',
      //   //     test: /antd/,
      //   //     priority: 100,
      //   //     name: 'vendors'
      //   //   }
      //   // }
      //   cacheGroups: {
      //     vendor: {
      //       chunks: 'all',
      //       test: /node_modules/,
      //       name: 'vendor',
      //       minChunks: 1,
      //       maxInitialRequests: 5,
      //       minSize: 0,
      //       priority: 100
      //     },
      //     common: {
      //       chunks: 'all',
      //       test: /\.(vue|js)$/,
      //       name: 'common',
      //       minChunks: 2,
      //       maxInitialRequests: 5,
      //       minSize: 0,
      //       priority: 60
      //     },
      //     styles: {
      //       name: 'styles',
      //       test: /\.(le|c)ss$/,
      //       chunks: 'all',
      //       enforce: true
      //     },
      //     runtimeChunk: {
      //       name: 'manifest'
      //     }
      //   }
    });
};
