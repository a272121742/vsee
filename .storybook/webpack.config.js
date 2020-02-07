
const path = require('path');
const cwd = process.cwd();
const resolve = (dir) => path.join(cwd, dir);

module.exports = async ({ config }) => {
  // config.module.rules[1] = {
  //   test: /\.vue$/,
  //   loaders: ['vue-loader', 'storybook-addon-vue-info/loader'],
  //   enforce: 'post',
  // };
  // config.module.rules.push({
  //   test: [/\.story\.js$/, /index\.js$/],
  //   loaders: [require.resolve('@storybook/addon-storysource/loader')],
  //   include: [path.resolve(__dirname, '../')],
  //   enforce: 'pre',
  // });
  // config.module.rules.push({
  //   test: /\.md$/,
  //   use: ['raw-loader'],
  // });
  // config.module.rules.push({
  //   resourceQuery: /blockType=docs/,
  //   use: ['storybook-readme/vue/docs-loader', 'html-loader', 'markdown-loader'],
  // });
  // // config.module.rules.push({
  // //   test: /iview\/.*?js$/,
  // //   loader: 'babel-loader'
  // // });
  // config.module.rules.push({
  //   test: /\.(html|tpl)$/,
  //   loader: 'html-loader'
  // });
  config.module.rules.push({
    test: /\.less$/,
    loader: "style-loader!css-loader!less-loader?javascriptEnabled=true",
  });
  config.module.rules.push({
    resourceQuery: /blockType=i18n/,
    type: 'javascript/auto',
    loader: '@kazupon/vue-i18n-loader'
  });
  config.resolve.extensions.push('.ts', '.tsx', '.vue');
  config.resolve.alias['@'] = resolve('./');
  
  config.resolve.alias['@comp'] = resolve('components');
  config.resolve.alias['@lib'] = resolve('lib');
  config.resolve.alias['@http'] = resolve('lib/http');
  config.resolve.alias['@store'] = resolve('lib/store');
  config.resolve.alias['@i18n'] = resolve('lib/i18n');
  config.resolve.alias['@router'] = resolve('lib/router');
  config.resolve.alias['@util'] = resolve('lib/utils');
  config.resolve.alias['@mix'] = resolve('lib/mixins');
  config.resolve.alias['@dir'] = resolve('lib/directives');
  // config.resolve.alias['@story'] = resolve('.storybook');
  config.resolve.alias['~'] = resolve('stories/src');
  return config;
};