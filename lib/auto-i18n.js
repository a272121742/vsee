/* eslint-disable no-shadow */
/**
 * 本模块提供所有国际化的加载
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { excludeModules } from '~/config.js';
import store from '@store';

store.dispatch('loadLanguage');
Vue.use(VueI18n);
console.log(store);
const local = store.getters.getLocal();

// 匹配模块下的`./module-name/locale/*.json`文件
const req = require.context('~', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\/locales\/[A-Za-z]+\.json$/);
const messages = {};
req
  .keys()
  .filter(path => !~excludeModules.indexOf(path.split('/')[1]))
  .forEach(key => {
    const matched = key.match(/([A-Za-z]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = { ...messages[locale], ...req(key) };
    }
  });

const i18n = new VueI18n({
  locale: local,
  fallbackLocale: local,
  messages
});

export default i18n;


