import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { merge } from 'lodash';
import store from '@store';
import common from './common.js';
import modules from './modules.js';

Vue.use(VueI18n);
store.dispatch('loadLanguage');

const local = store.getters.getLocal();
const messages = merge({}, common, ...modules);
const i18n = new VueI18n({
  locale: local,
  fallbackLocale: local,
  messages,
});

export default i18n;
