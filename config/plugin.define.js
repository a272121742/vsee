const moment = require('moment');
const userName = require('git-user-name');

const project = process.env.npm_config_project;
const isProd = process.env.NODE_ENV === 'production';
/**
 * 是否代理（test: true - 代理模式； false - 本地模拟）
 * 1. 生产模式下，如果配置了test，则连接模拟数据，反之连接代理
 * 2. 开发模式下，如果配置了test，则连接代理，反之连接模式数据
 */
const proxy = (isProd && !process.env.npm_config_test) || (!isProd && !!process.env.npm_config_test);

module.exports = (config) => {
  config.plugin('define')
    .tap((args) => {
      args[0]['process.env'].proxy = proxy;
      args[0]['process.env'].project = JSON.stringify(project);
      args[0]['process.env'].buildDate = JSON.stringify(moment().format('YYYY/MM/DD HH:mm:ss'));
      args[0]['process.env'].user = JSON.stringify(userName());
      return args;
    });
};
