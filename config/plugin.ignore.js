const IgnorePlugin = require('webpack/lib/IgnorePlugin');

// const isProd = process.env.NODE_ENV === 'production';
// const proxy = (isProd && !process.env.npm_config_test) || (!isProd && !!process.env.npm_config_test);

module.exports = (config) => {
  config
    .plugin('ignore-moment')
    .use(new IgnorePlugin(/^\.\/locale$/, /moment$/))
    .end();
};
