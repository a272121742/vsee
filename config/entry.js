const isProd = process.env.NODE_ENV === 'production';
// 数据加载模式（test: true - 联调模式； false - 本地模式）
const test = !!process.env.npm_config_test || isProd; // 以后生产环境默认开启

module.exports = config => {
  config
    .entry('app')
    .clear()
    .add('@babel/polyfill')
    .add('~/main.js');

  !test && (config.entry('app').add('@lib/inject-mock.js'));
};
