const isProd = process.env.NODE_ENV === 'production';

module.exports = (config) => {
  config
    .entry('app')
    .clear()
    .add('@babel/polyfill')
    .add('~/main.js');

  !isProd && (config.entry('app').add('@lib/inject-mock.js'));
};
