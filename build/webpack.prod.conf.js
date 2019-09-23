"use strict";

const path = require("path");
const os = require('os');
const merge = require("webpack-merge");

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const utils = require("./utils");
const config = require("../config");
const baseWebpackConfig = require("./webpack.base.conf");

const project = process.env.npm_config_project;

if (process.env.npm_config_mock) {
  console.log('打包模拟数据');
  baseWebpackConfig.entry.push('@lib/inject-mock.js');
}

const unzip = Object.prototype.hasOwnProperty.call(process.env, 'npm_config_unzip');

console.log(unzip ? '不压缩模式' : '压缩模式');

const webpackConfig = merge(baseWebpackConfig, {
  mode: config.build.mode,
  module: {
    // 调用utils.styleLoaders的方法
    rules: utils.styleLoaders({
      //开启调试的模式。默认为true
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  output: {
    // 文件输出地址
    // path: path.resolve(__dirname, `../dist/${project}`),
    path: config.build.assetsRoot,
    filename: utils.assetsPath(`js/[name].[chunkhash].js`),
    chunkFilename: utils.assetsPath(`js/[id].[chunkhash].js`),
    publicPath: config.build.assetsPublicPath
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  optimization: unzip ? {} : {
    // 代码分片
    splitChunks: {
      chunks: 'all', // initial、async和all
      minSize: 30000, // 形成一个新代码块最小的体积
      maxAsyncRequests: 5, // 按需加载时候最大的并行请求数
      maxInitialRequests: 3, // 最大初始化请求数
      automaticNameDelimiter: '~', // 打包分割符
      name: true,
      cacheGroups: {
        vendors: { // 项目基本框架等
          chunks: 'all',
          test: /antd/,
          priority: 100,
          name: 'vendors',
        }
      }
    },
    minimizer: [
      // 高压缩代码插件
      new TerserPlugin({
        parallel: os.cpus().length,
        cache: true,
        sourceMap: config.build.productionSourceMap,
        terserOptions: {
          //警告：true保留警告，false不保留
          warnings: false,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
          compress: {
            //打印语句：true去掉，false保留
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
          },
          output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
          }
        }
      }),
      // 压缩样式插件
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: config.build.productionSourceMap ? {
          safe: true,
          discardComments: {
            removeAll: true
          },
          map: {
            inline: false
          }
        } : {
          safe: true
        }
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ...require('../config/prod.env'),
        project: JSON.stringify(project),
        isMock: JSON.stringify(!!process.env.npm_config_mock)
      }
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath(`css/[name].[chunkhash].css`),
      chunkFilename: utils.assetsPath(`css/[id].[chunkhash].css`)
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: "index.html",
      inject: true,
      hash: true,
      minify: {
        // 删除注释
        removeComments: true,
        // 删除空格
        collapseWhitespace: true,
        // 删除属性的引号
        removeAttributeQuotes: true,
        // 以下为其他配置
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // 模块排序，按照我们需要的顺序排序
      chunksSortMode: 'auto'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting

    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, "../static"),
      to: path.resolve(config.build.assetsRoot, '../static'),
      ignore: [".*"]
    }]),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
});

if (process.env.npm_config_ftp) {
  console.log('打包到服务器上');
  const WebpackSftpClient = require('webpack-sftp-client');
  webpackConfig.plugins.push(new WebpackSftpClient({
    port: 22,
    host: '106.75.63.69',
    username: 'root',
    password: '7kf4s?8At[k(',
    path: path.resolve(config.build.assetsRoot, `../`),
    remotePath: '/data/local/nginx/nginx/html',
    verbose: false
  }));
}

// 如果开启了生产环境的Gzip压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require("compression-webpack-plugin");
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      // asset: "[path].gz[query]", // 1.x.x 改为此属性
      filename: "[path].gz[query]", // 2.x.x 改为此属性
      algorithm: "gzip",
      test: new RegExp(
        "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}



module.exports = webpackConfig;