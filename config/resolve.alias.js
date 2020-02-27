const path = require('path');

const cwd = process.cwd();
const resolve = (dir) => path.join(cwd, dir);
const project = process.env.npm_config_project;
const innerModule = /node_module\/vsee/.test(__dirname);

module.exports = (config) => {
  // 添加别名
  config.resolve.alias
    .set('@', resolve('./'))
    .set('~', resolve(`projects/${project}`))
    .set('~~', resolve(`projects/${project}/common`))
    .set('@comp', resolve('components'))
    .set('@lib', innerModule ? 'vsee/lib' : resolve('lib'))
    .set('@router', innerModule ? 'vsee/lib/router' : resolve('lib/router'))
    .set('@store', innerModule ? 'vsee/lib/store' : resolve('lib/store'))
    .set('@http', innerModule ? 'vsee/lib/http' : resolve('lib/http'))
    .set('@i18n', innerModule ? 'vsee/lib/i18n' : resolve('lib/i18n'))
    .set('@util', innerModule ? 'vsee/lib/utils' : resolve('lib/utils'))
    .set('@mix', innerModule ? 'vsee/lib/mixins' : resolve('lib/mixins'))
    .set('@dir', innerModule ? 'vsee/lib/directives' : resolve('lib/directives'))
    .set('@static', resolve('public/static'));
};
