const js = [
  // '/static/lib/vue-i18n.min.js',
  // '/static/lib/vue.min.js',
  // '/static/lib/vue-router.min.js',
  // '/static/lib/vuex.min.js',
  // '/static/lib/axios.min.js',
  // '/static/lib/echarts.min.js',
  // '/static/lib/vue-echarts.js',
];
const css = [];
module.exports = (config) => {
  config.externals({
    // vue: 'Vue',
    // 'vue-router': 'VueRouter',
    // 'vue-i18n': 'VueI18n',
    // vuex: 'Vuex',
    // axios: 'axios',
    // echarts: 'echarts',
    // 'vue-echarts': true,
  });
  config.plugin('html').tap((args) => {
    args[0].js = js;
    args[0].css = css;
    // 修复 Lazy loading routes Error
    args[0].chunksSortMode = 'dependency';
    return args;
  });
};
