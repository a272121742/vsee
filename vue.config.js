const fs = require('fs');
const path = require('path');

const uselib = !!process.env.npm_config_uselib;

const cwd = process.cwd();
const resolve = (...dir) => path.join(cwd, ...dir);
const configs = Object.values(require('require-all')({
  dirname: resolve(uselib ? 'node_modules/vsee/config' : 'config'),
}));

const isProd = process.env.NODE_ENV === 'production';

// 查询启动项目
const project = process.env.npm_config_project;
const hasTheme = fs.existsSync(resolve('projects', project, 'theme.js'));

console.log('启动的项目是', project);
/**
 * 是否代理（test: true - 代理模式； false - 本地模拟）
 * 1. 生产模式下，如果配置了test，则连接模拟数据，反之连接代理
 * 2. 开发模式下，如果配置了test，则连接代理，反之连接模式数据
 */
const proxy = (isProd && !process.env.npm_config_test) || (!isProd && !!process.env.npm_config_test);
console.log('【当前模式】：', isProd ? '生产' : '开发', proxy ? '代理模式' : '本地模拟');

// 修改主题配色
let theme = {};
if (hasTheme) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  theme = require(`./projects/${project}/theme.js`);
}

module.exports = {
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true);
    config.plugins.delete('prefetch');
    configs.forEach((fn) => fn(config));

    if (process.env.NODE_ENV === 'production') {
      // index.html 代码压缩
      config.plugin('html').tap((args) => {
        args[0].minify.useShortDoctype = true;
        args[0].minify.removeEmptyAttributes = true;
        args[0].minify.removeRedundantAttributes = true;
        args[0].minify.keepClosingSlash = true;
        args[0].minify.minifyJS = true;
        args[0].minify.minifyCSS = true;
        args[0].minify.minifyURLs = true;
        return args;
      });
    } else {
      console.log();
    }
  },
  // lintOnSave: process.env.NODE_ENV !== 'production',
  outputDir: `dist/${project}`,
  lintOnSave: true,
  publicPath: process.env.NODE_ENV === 'production' ? `/${project}/` : '/',
  productionSourceMap: !isProd,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: theme,
        javascriptEnabled: true,
      },
    },
  },
  // 代理配置
  devServer: {
    overlay: {
      warnings: !isProd,
      errors: !isProd,
    },
    // 代理配置
    proxy: proxy ? {
      '/api': {
        target: 'http://106.75.63.69:8091/mojo-gateway',
        // target: 'http://192.168.3.60:18080',
        changeOrigin: true,
        // 关闭https安全证书
        secure: false,
        // 重写接口
        pathRewrite: {
          '^/api': '', // ，将"以/api开头"的字符串替换为“”
        },
      },
    } : void 0,
  },
  // echarts必须此配置
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
  ],
};
