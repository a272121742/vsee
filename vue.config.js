const path = require('path');
const webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, dir);
}
const project = process.env.npm_config_project;
process.env.VUE_APP_PROJECT = project;
console.log('启动的项目是', project);
const test = !!process.env.npm_config_test;
process.env.VUE_APP_TESTING = test;
console.log('是否测试模式', test);
process.env.VUE_APP_API = `/${project}`;
process.env.VUE_APP_PIXAPI = '/api';


module.exports = {
  configureWebpack: (config) => {
    config.resolve.alias['@'] = resolve('./');
    config.resolve.alias['@@'] = resolve(`projects/${project}`);
    config.resolve.alias['@@cmd'] = resolve(`projects/${project}/common`);
    config.resolve.alias['@comp'] = resolve('components');
    config.resolve.alias['@lib'] = resolve('lib');
    config.resolve.alias['@util'] = resolve('lib/utils');
    config.resolve.alias['@mix'] = resolve('lib/mixins');
    config.resolve.alias['@dir'] = resolve('lib/directives');
    config.resolve.alias['@static'] = resolve('static');
    config.entry.app[0] = '@@/main.js';
    if (process.env.NODE_ENV === 'production') {

    } else {
      // 为开发环境修改配置...
      !test && (config.entry.app.push('@lib/inject-mock.js'));
    }
  },
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
        .loader('@kazupon/vue-i18n-loader')
        .end();
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // config.plugin('sftp').use(require,resolve('webpack-sftp-client'), [{
      //   port: 22,
      //   host: '106.75.63.69',
      //   username: 'root',
      //   password: '7kf4s?8At[k(',
      //   path: 'dist',
      //   remotePath: `/data/local/nginx/nginx/html/${project}_demo/`,
      //   verbose: false
      // }]);
      // console.log('路径', config.output.get('path'));
    } else {

    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: process.env.NODE_ENV === 'production' ? `/${project}/` : '/',
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less'
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#0097E0', // 全局主色
          'link-color': '#0097E0', // 链接色
          'success-color': '#B7D342', // 成功色
          'warning-color': '#FABE00', // 警告色
          'error-color': '#D1291A', // 错误色
          'font-size-base': '14px', // 主字号
          'heading-color': 'rgba(0, 0, 0, .85)', // 标题色
          'text-color': 'rgba(0, 0, 0, .65)', // 主文本色
          'text-color-secondary': 'rgba(0, 0, 0, .45)', // 次文本色
          'disabled-color': 'rgba(0, 0, 0, .25)', // 失效色
          'border-radius-base': '4px', // 组件/浮层圆角
          'border-color-base': '#d9d9d9', // 边框色
          'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)' // 浮层阴影
        },
        javascriptEnabled: true
      }
    }
  },
  lintOnSave: false,
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: !test ? undefined : {
      '/api': {
        target: 'http://106.75.63.69:8091/mojo-gateway',
        changeOrigin: true,
        // 关闭https安全证书
        secure: false,
        // 重写接口
        pathRewrite: {
          '^/api': '' // ，将"以/api开头"的字符串替换为“”
        }
      }
    }
  }
};
