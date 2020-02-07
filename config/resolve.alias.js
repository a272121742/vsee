const path = require('path');

const cwd = process.cwd();
const resolve = (dir) => path.join(cwd, dir);
const project = process.env.npm_config_project;

module.exports = (config) => {
  // 添加别名
  config.resolve.alias
    .set('@', resolve('./'))
    .set('~', resolve(`projects/${project}`))
    .set('~~', resolve(`projects/${project}/common`))
    .set('@comp', resolve('components'))
    .set('@lib', resolve('lib'))
    .set('@router', resolve('lib/router'))
    .set('@store', resolve('lib/store'))
    .set('@http', resolve('lib/http'))
    .set('@i18n', resolve('lib/i18n'))
    .set('@util', resolve('lib/utils'))
    .set('@mix', resolve('lib/mixins'))
    .set('@dir', resolve('lib/directives'))
    .set('@static', resolve('public/static'));
};
