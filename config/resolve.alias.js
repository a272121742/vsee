const path = require('path');

const resolve = dir => path.join(__dirname, '../', dir);
const project = process.env.npm_config_project;

module.exports = config => {
  // 添加别名
  config.resolve.alias
    .set('@', resolve('./'))
    .set('~', resolve(`projects/${project}`))
    .set('~~', resolve(`projects/${project}/common`))
    .set('@comp', resolve('components'))
    .set('@lib', resolve('lib'))
    .set('@store', resolve('lib/store'))
    .set('@util', resolve('lib/utils'))
    .set('@mix', resolve('lib/mixins'))
    .set('@dir', resolve('lib/directives'))
    .set('@static', resolve('lib/static'));
};
