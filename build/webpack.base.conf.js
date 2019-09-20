'use strict'

const os = require('os');
const path = require('path');
const {
  VueLoaderPlugin
} = require('vue-loader');
const HappyPack = require('happypack');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

var happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

const isProd = process.env.NODE_ENV === 'production';

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|jsx|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('projects'), resolve('test')],
  exclude: /node_modules/,
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const exportConfig = {
  context: path.resolve(__dirname, '../'),
  entry: [
    `@@/main.js`
  ],
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    // 自动的扩展后缀，比如一个js文件，则引用时书写可不要写.js
    extensions: ['.js', '.vue', '.json', '.md'],
    // 创建路径的别名
    alias: {
      '@': resolve('./'),
      // 当前项目路径
      '@@': resolve('projects/' + utils.project),
      '@@cmd': resolve('projects/' + utils.project + '/common'),
      '@comp': resolve('components'),
      '@lib': resolve('lib'),
      '@mix': resolve('lib/mixins'),
      '@util': resolve('lib/utils'),
      '@dir': resolve('lib/directives'),
      '@static': resolve('static'),
    },
    // 配置搜索模块，以减少搜索范围
    modules: [
      path.resolve(__dirname, '../node_modules'),
    ]
  },
  module: {
    rules: [
      // 是否启用eslint代码检查
      ...(!isProd && config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@kazupon/vue-i18n-loader'
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happybabel',
        include: [resolve('projects'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
        exclude: /node_modules/,
      },
      {
        test: /\.js[x]?$/,
        include: [resolve('projects'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
        exclude: /node_modules/,
        loader: 'happypack/loader?id=happybabel'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('image/[name].[hash:10].[ext]')
        }
      },
      {
        // 图片处理，小于1kb会编译成Base64
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: utils.assetsPath('image/[name].[hash:7].[ext]')
        }
      },
      {
        // 字体处理，小于1kb会编译成Base64
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: utils.assetsPath('font/[name].[hash:7].[ext]')
        }
      },
      {
        // 字体处理，小于10kb会编译成Base64
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // 性能提示，参考 http://www.css88.com/doc/webpack2/configuration/performance/
  performance: {
    // 入口起点的最大资源体积
    maxEntrypointSize: 204800,
    // 最大生成资源体积
    maxAssetSize: 204800,
    hints: isProd ? 'warning' : false
  },
  plugins: [
    new VueLoaderPlugin(),
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool,
      verbose: true
    })
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};

module.exports = exportConfig;