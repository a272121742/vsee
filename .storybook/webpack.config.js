const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules[1] = {
    test: /\.vue$/,
    loaders: ['vue-loader', 'storybook-addon-vue-info/loader'],
    enforce: 'post',
  };
  // config.module.rules.push({
  //   test: [/\.story\.js$/, /index\.js$/],
  //   loaders: [require.resolve('@storybook/addon-storysource/loader')],
  //   include: [path.resolve(__dirname, '../')],
  //   enforce: 'pre',
  // });
  config.module.rules.push({
    test: /\.md$/,
    use: ['raw-loader'],
  });
  config.module.rules.push({
    resourceQuery: /blockType=docs/,
    use: ['storybook-readme/vue/docs-loader', 'html-loader', 'markdown-loader'],
  });
  // config.module.rules.push({
  //   test: /iview\/.*?js$/,
  //   loader: 'babel-loader'
  // });
  config.module.rules.push({
    test: /\.(html|tpl)$/,
    loader: 'html-loader'
  });
  
  config.resolve.extensions.push('.ts', '.tsx', '.vue');
  config.resolve.alias['@'] = path.resolve('src');

  return config;
};