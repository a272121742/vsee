const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const cwd = process.cwd();
const resolve = (dir) => path.join(cwd, dir);

module.exports = async ({ config }) => {
  // config.plugins.push(new CopyWebpackPlugin([{
  //   from: resolve(".storybook/public"),
  //   to: resolve("storybook-static/static"),
  //   ignore: [".*"]
  // }]));
  config.module.rules.push({
    test: /\.less$/,
    loader: "style-loader!css-loader!less-loader?javascriptEnabled=true",
  });
  config.module.rules.push({
    resourceQuery: /blockType=i18n/,
    type: 'javascript/auto',
    loader: '@intlify/vue-i18n-loader'
  });
  config.resolve.extensions.push('.ts', '.tsx', '.vue');
  config.resolve.alias['@'] = resolve('./');
  
  config.resolve.alias['@comp'] = resolve('components');
  config.resolve.alias['@lib'] = ('vsee/lib');
  config.resolve.alias['@http'] = ('vsee/lib/http');
  config.resolve.alias['@store'] = ('vsee/lib/store');
  config.resolve.alias['@i18n'] = ('vsee/lib/i18n');
  config.resolve.alias['@router'] = ('vsee/lib/router');
  config.resolve.alias['@util'] = ('vsee/lib/utils');
  config.resolve.alias['@mix'] = ('vsee/lib/mixins');
  config.resolve.alias['@dir'] = ('vsee/lib/directives');
  config.resolve.alias['@aop'] = ('vsee/lib/aop');
  config.resolve.alias['@mock'] = ('vsee/lib/mock');
  config.resolve.alias['@layout'] = ('vsee/layout');
  config.resolve.alias['~'] = resolve('.storybook/src');
  return config;
};