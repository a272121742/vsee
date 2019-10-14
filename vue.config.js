const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const configs = Object.values(require('require-all')({
  dirname: resolve('config')
}));
const isProd = process.env.NODE_ENV === 'production';

// 查询启动项目
const project = process.env.npm_config_project;
console.log('启动的项目是', project);
// 数据加载模式（test: true - 联调模式； false - 本地模式）
const test = !!process.env.npm_config_test || isProd; // 以后生产环境默认开启
console.log('是否联调模式', test);

// 修改主题配色
const theme = require(`./projects/${project}/theme.js`);

module.exports = {
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
    configs.forEach(fn => fn(config));

    if (process.env.NODE_ENV === 'production') {
      // index.html 代码压缩
      config.plugin('html').tap(args => {
        args[0].minify.useShortDoctype = true;
        args[0].minify.removeEmptyAttributes = true;
        args[0].minify.removeRedundantAttributes = true;
        args[0].minify.keepClosingSlash = true;
        args[0].minify.minifyJS = true;
        args[0].minify.minifyCSS = true;
        args[0].minify.minifyURLs = true;
        return args;
      });


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
      preProcessor: 'less'
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: theme,
        javascriptEnabled: true
      }
    }
  },
  // 代理配置
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    // 代理配置
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
