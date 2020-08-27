const isProd = process.env.NODE_ENV === 'production';
const unzip = !!process.env.npm_config_unzip;

module.exports = (config) => {
  isProd && !unzip
    && config.optimization.splitChunks({
      chunks: 'all',
      maxSize: 200000,
      maxInitialRequests: Infinity,
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(le|c)ss$/,
          chunks: 'all',
          priority: 100,
          enforce: true,
        },
        vsee: {
          name: 'chunk-core',
          test: /[\\/]node_modules[\\/]vsee[\\/]/,
          chunks: 'async',
          priority: 80,
          reuseExistingChunk: true,
          enforce: true,
        },
        antd: {
          name: 'chunk-antd',
          test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
          chunks: 'all',
          priority: 80,
          reuseExistingChunk: true,
          enforce: true,
        },
        antv: {
          name: 'chunk-antv',
          test: /[\\/]node_modules[\\/]*?antv[\\/]/,
          chunks: 'all',
          priority: 80,
          reuseExistingChunk: true,
          enforce: true,
        },
        echarts: {
          name: 'chunk-echarts',
          test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
          chunks: 'all',
          priority: 80,
          reuseExistingChunk: true,
          enforce: true,
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    });
};
