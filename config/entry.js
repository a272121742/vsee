const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const resolve = (...dir) => path.join(cwd, ...dir);
const project = process.env.npm_config_project;

const hasBootstrap = fs.existsSync(resolve('projects', project, 'bootstrap.js'));
const isProd = process.env.NODE_ENV === 'production';

/**
 * 是否代理（test: true - 代理模式； false - 本地模拟）
 * 1. 生产模式下，如果配置了test，则连接模拟数据，反之连接代理
 * 2. 开发模式下，如果配置了test，则连接代理，反之连接模式数据
 */
const proxy = (isProd && !process.env.npm_config_test) || (!isProd && !!process.env.npm_config_test);

module.exports = (config) => {
  const entry = config.entry('app').clear();
  hasBootstrap && (entry.add(`~/bootstrap.js`));
  entry.add('@babel/polyfill').add('~/main.js');
  !proxy && (entry.add('@lib/inject-mock.js'));
};
