const path = require('path');

const cwd = process.cwd();
const resolve = (dir) => path.join(cwd, dir);
const project = process.env.npm_config_project;
const innerModule = /[\\/]node_modules[\\/]vsee/.test(__dirname);

const isProd = process.env.NODE_ENV === 'production';
const proxy = (isProd && !process.env.npm_config_test) || (!isProd && !!process.env.npm_config_test);

module.exports = (config) => {
  // 添加别名
  config.resolve.alias
    .set('@', resolve('./'))
    .set('~', resolve(`projects/${project}`))
    .set('~~', resolve(`projects/${project}/common`))
    .set('@comp', resolve('components'))
    .set('@layout', innerModule ? 'vsee/layout' : resolve('layout'))
    .set('@lib', innerModule ? 'vsee/lib' : resolve('lib'))
    .set('@router', innerModule ? 'vsee/lib/router' : resolve('lib/router'))
    .set('@store', innerModule ? 'vsee/lib/store' : resolve('lib/store'))
    .set('@http', innerModule ? 'vsee/lib/http' : resolve('lib/http'))
    .set('@i18n', innerModule ? 'vsee/lib/i18n' : resolve('lib/i18n'))
    .set('@util', innerModule ? 'vsee/lib/utils' : resolve('lib/utils'))
    .set('@mix', innerModule ? 'vsee/lib/mixins' : resolve('lib/mixins'))
    .set('@aop', innerModule ? 'vsee/lib/aop' : resolve('lib/aop'))
    .set('@dir', innerModule ? 'vsee/lib/directives' : resolve('lib/directives'))
    .set('@static', resolve('public/static'))
    .set('@mock', innerModule ? 'vsee/lib/mock' : resolve('lib/mock'));
};
