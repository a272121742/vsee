const path = require('path');
// 加载webpack
const webpack = require('webpack');
// 通过webpack-merge实现webpack.dev.conf.js对wepack.base.config.js的继承
const merge = require('webpack-merge');
// 将单个文件或整个目录复制到生成目录 https://github.com/webpack-contrib/copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 简化HTML文件创建以服务捆绑包的插件 https://github.com/jantimon/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 简化webpack报错 https://github.com/geowarin/friendly-errors-webpack-plugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// 查看空闲端口位置，默认情况下搜索8000这个端口 https://github.com/indexzero/node-portfinder
const portfinder = require('portfinder');


// 加载环境配置
const config = require('../config');
// 加载webpack基础配置
const baseWebpackConfig = require('./webpack.base.conf');
// 加载构建工具
const utils = require('./utils');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

// ------- 注入系统环境 begin --------////////////////////////////////////////////////////////////////////////
const env = require('../config/dev.env');
// 如果是开发联调模式
if (process.env.npm_config_test) {
  env.testing = JSON.stringify(true);
  const proxyTable = config.dev.proxyTable;
  const keys = Object.keys(proxyTable);
  env.proxyServerPix = JSON.stringify(keys[0]);
} else {
  env.testing = JSON.stringify(false);
}
env.baseUrl = JSON.stringify(config.dev.assetsPublicPath);
// ------- 注入系统环境 end -----------////////////////////////////////////////////////////////////////////////
const devWebpackConfig = merge(baseWebpackConfig, {
  entry: [
    `@lib/inject-mock.js`
  ],
  mode: config.dev.mode,
  module: {
    // 规则是工具utils中处理出来的styleLoaders，生成了css，less,postcss等规则
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  output: {
    publicPath: config.dev.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  /**
   * 服务器配置
   * webpack-dev-server的相关啊配置
   */
  devServer: {
    // 日志级别，控制台显示的选项有none, error, warning 或者 info
    clientLogLevel: 'error',
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }]
    },
    // 是否热加载
    hot: true,
    inline: true,
    progress: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    // 是否启用`gzip`压缩
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    // 默认是否打开浏览器
    open: config.dev.autoOpenBrowser,
    // 在编译出错的时候，在浏览器页面上是否显示错误
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    // 项目目录
    publicPath: config.dev.assetsPublicPath,
    // 网络代理
    proxy: config.dev.proxyTable,
    // 当它被设置为true的时候，控制台只输出第一次编译的信息。此配置需要FriendlyErrorsPlugin插件
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      ignored: /node_modules/,
      // 文件系统检测改动
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ...require('../config/dev.env'),
        project: JSON.stringify(utils.project),
        isTest: JSON.stringify(!!process.env.npm_config_test)
      }
    }),
    // 热更新模块
    new webpack.HotModuleReplacementPlugin(),
    /**
     * 这个模块可以将依赖模块的正整数 ID 替换为相对路径（如：将 4 替换为 ./node_modules/es6-promise/dist/es6-promise.js）。
     *  - 开发模式，它可以让 webpack-dev-server 和 HMR 进行热更新时在控制台输出模块名字而不是纯数字；
     *  - 生产构建环境，它可以避免因修改内容导致的 ID 变化，从而实现持久化缓存。
     */
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
    new webpack.NoEmitOnErrorsPlugin(),
    // // 生成HTML模版 https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'vsee',
      filename: 'index.html',
      template: 'index.html'
      // inject: true
    }),
    // 复制插件
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  // 查找端口号
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 端口被占用时就重新设置evn和devServer的端口
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // 友好地输出信息
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [
            `项目： ${utils.project}`,
            `编辑模式： ${env.testing === 'true' ? '联调开发模式' : '离线开发模式'}`, `您的应用已启动： http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback() : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
});
