module.exports = (config) => {
  // 配置国际化
  config.module
    .rule('i18n')
    .resourceQuery(/blockType=i18n/)
    .type('javascript/auto')
    .use('i18n')
    .loader('@kazupon/vue-i18n-loader')
    .end();
};
