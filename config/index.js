"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");
const project = process.env.npm_config_project;

module.exports = {
  dev: {
    mode: "development",
    // Paths
    assetsSubDirectory: "./",
    assetsPublicPath: "/",
    // 静态资源文件目录，一般存放css、js、image、font等
    assetsSubDirectory: 'static',
    /**
     * 服务配置
     */
    // 服务器地址，可重写process.env.HOST
    host: '0.0.0.0',
    // 服务器端口，端口号占用出现问题可在此处修改
    port: 8080,
    // 是否自动打开浏览器
    autoOpenBrowser: false,
    // 浏览器错误提示
    errorOverlay: true,
    // 跨平台错误提示
    notifyOnErrors: true,
    // 使用文件系统(file system)获取文件改动的通知devServer.watchOptions，更多信息请参阅 https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    poll: 1000,
    // 跨域配置
    proxyTable: {
      '/api': {

        target: 'http://106.75.63.69:8080',
        // target: 'http://106.75.63.69:8091',

       
        changeOrigin: true,
        // 关闭https安全证书
        secure: false,
        // 重写接口
        pathRewrite: {
          '^/api': '' // ，将"以/api开头"的字符串替换为“”
        }
      },
      '/trans_api': {
        target: 'http://api.fanyi.baidu.com',
        changeOrigin: true,
        // 关闭https安全证书s
        secure: false,
        pathRewrite: {
          '^/trans_api': ''
        }
      }
    },

    /**
     * 代码配置
     */
    // https://webpack.js.org/configuration/devtool/#development
    // 增加调试，该属性为原始源代码（仅限行）不可在生产环境中使用
    devtool: 'cheap-module-eval-source-map',
    // 是否使缓存失效，如果你需要在开发者工具调试vue文件，设置为false
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    //代码压缩后进行调bug定位将非常困难，于是引入sourcemap记录压缩前后的位置信息记录，当产生错误时直接定位到未压缩前的位置，将大大的方便我们调试
    cssSourceMap: true,
    // 是否启用Eslint的检查
    useEslint: true,
    // 是否全局显示Eslint的错误提示
    showEslintErrorsInOverlay: false,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
  },

  build: {
    mode: "production",
    // index编译后生成的位置和名字，根据需要改变后缀
    index: path.resolve(__dirname, `../dist/${project}/index.html`), // 项目dist文件夹
    // index: `/usr/local/var/www/${project}/index.html`,

    // 输出根目录，编译后存放生成环境代码的位置
    assetsRoot: path.resolve(__dirname, `../dist/${project}`), // 项目dist文件夹
    // assetsRoot: `/usr/local/var/www/${project}`, // 其他文件夹

    // 静态资源文件目录，一般存放css、js、image、font等
    // assetsSubDirectory: path.resolve(__dirname, '../dist/static'), // "./",
    assetsSubDirectory: '',
    // 发布的根目录，通常本地打包dist后打开文件会报错，此处修改为./。如果是上线的文件，可根据文件存放位置进行更改路径
    assetsPublicPath: `/${project}/`, // "./",

    /**
     * Source Maps
     */

    productionSourceMap: true, //true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "source-map",

    //unit的gzip命令用来压缩文件，gzip模式下需要压缩的文件的扩展名有js和css，默认为false，因为绝大部分静态资源服务器都已经开启了Gzip压缩，如果你在webpack中开启，你可以通过命令`npm install --save-dev compression-webpack-plugin`来安装所需模块
    productionGzip: true,
    productionGzipExtensions: ["js", "css", "html", "htm", "md"],

    // 打包可视化工具，你可以通过运行`npm run build --report`来开启，或直接设置`true`活`false`来开启或关闭
    bundleAnalyzerReport: process.env.npm_config_report || false
  }
};