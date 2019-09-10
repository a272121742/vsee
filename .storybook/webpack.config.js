const path = require('path');
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.vue$/,
    loader: 'storybook-addon-vue-info/loader',
    enforce: 'post',
  });
  config.module.rules.push({
    resourceQuery: /blockType=i18n/,
    type: 'javascript/auto',
    loader: '@kazupon/vue-i18n-loader'
  });
  console.log(config.resolve);
  config.resolve.extensions.push('.md', '.mdx');
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': resolve('./'),
    '@comp': resolve('components'),
    '@lib': resolve('lib'),
    '@mix': resolve('lib/mixins'),
    '@util': resolve('lib/utils'),
    '@dir': resolve('lib/directives'),
    '@static': resolve('static'),
  };
  return config;
};