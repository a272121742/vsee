const path = require('path');

const uselib = !!process.env.npm_config_uselib;

const cwd = process.cwd();
const resolve = (...dir) => path.join(cwd, ...dir);
const configs = Object.values(require('require-all')({
  dirname: resolve(!uselib ? 'node_modules/vsee/config' : 'config'),
}));

const isProd = process.env.NODE_ENV === 'production';

// 查询启动项目
const project = process.env.npm_config_project;

console.log('启动的项目是', project);
/**
 * 是否代理（test: true - 代理模式； false - 本地模拟）
 * 1. 生产模式下，如果配置了test，则连接模拟数据，反之连接代理
 * 2. 开发模式下，如果配置了test，则连接代理，反之连接模式数据
 */
const proxy = (isProd && !process.env.npm_config_test) || (!isProd && !!process.env.npm_config_test);
console.log('【当前模式】：', isProd ? '生产' : '开发', proxy ? '代理模式' : '本地模拟', uselib ? '测试lib' : '正式lib');

module.exports = {
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true);
    configs.forEach((fn) => fn(config));
  },
  // lintOnSave: process.env.NODE_ENV !== 'production',
  outputDir: `dist/${project}`,
  lintOnSave: true,
  publicPath: process.env.NODE_ENV === 'production' ? `/${project}/` : '/',
  productionSourceMap: !isProd,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // 代理配置
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      '/api': {
        target: 'http://tqis-dev.autodev.aas/mojo-gateway/',
        changeOrigin: true,
        // 关闭https安全证书
        secure: false,
        // 重写接口
        pathRewrite: {
          '^/api': '', // ，将"以/api开头"的字符串替换为“”
        },
      },
    },
  },
  // echarts必须此配置
  transpileDependencies: [
    'vsee',
    'vue-echarts',
    'resize-detector',
  ],
};
