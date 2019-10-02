/* eslint-disable no-shadow */
/**
 * 本模块提供所有国际化的加载
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { autoRequires, excludeModules } from '~/config.js';
import Cookies from 'js-cookie';
const locale = Cookies.get('language') || 'zh_CN';
const language = locale.split('_')[0];

Vue.use(VueI18n);
const messages = i18nRequest(autoRequires, excludeModules);

const i18n = new VueI18n({
  locale: language,
  fallbackLocale: language,
  messages
});

export default i18n;

function i18nRequest (autoRequires, excludeModules) {
  // 匹配模块下的`./module-name/locale/*.json`文件
  const req = autoRequires.i18n;
  const messages = {}
  req
    .keys()
    .filter(path => !~excludeModules.indexOf(path.split('/')[1]))
    .forEach(key => {
      const matched = key.match(/([A-Za-z]+)\./i);
      if (matched && matched.length > 1) {
        const locale = matched[1];
        messages[locale] = { ...messages[locale], ...req(key) };
      }
    })
  return messages;
}
