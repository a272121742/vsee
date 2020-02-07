const isProd = process.env.NODE_ENV === 'production';
const unzip = !!process.env.npm_config_unzip;

module.exports = (config) => {
  isProd && !unzip
    && config.optimization.splitChunks({
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: Infinity,
      cacheGroups: {
        common: {
          name: 'chunk-common',
          chunks: 'initial',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
        vendors: {
          name (module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          test: /[\\/]node_modules[\\/]/,
          priority: 2,
          chunks: 'initial',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          reuseExistingChunk: true,
          enforce: true,
        },
        antD: {
          name: 'chunk-antd',
          test: /[\\/]node_modules[\\/]ant-design[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        echarts: {
          name: 'chunk-echarts',
          test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
          chunks: 'all',
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
        },
        utils: {
          test: /\.js$/,
          chunks: 'initial',
          name: 'common-utils',
          maxSize: 30000,
        },
        styles: {
          name: 'styles',
          test: /\.(le|c)ss$/,
          chunks: 'all',
          enforce: true,
        },
      },
    });
};
