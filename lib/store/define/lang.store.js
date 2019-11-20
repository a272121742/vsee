import moment from 'moment';
import Cookies from 'js-cookie';
import { transLanguage, getPrimaryTag, toAntD, toMoment } from '@util/localhelper.js';
import { LANGUAGE_KEY } from '~/config.js';

Cookies.set(LANGUAGE_KEY, transLanguage(Cookies.get(LANGUAGE_KEY)));

export default {
  state: {
    language: transLanguage(Cookies.get(LANGUAGE_KEY)),
    local: getPrimaryTag(transLanguage(Cookies.get(LANGUAGE_KEY))),
    local4antd: {}
  },
  getters: {
    getLanguage: () => () => transLanguage(Cookies.get(LANGUAGE_KEY)),
    getLocal: () => () => getPrimaryTag(transLanguage(Cookies.get(LANGUAGE_KEY)))
  },
  mutations: {
    setLanguage (state, language) {
      state.language = transLanguage(language);
      Cookies.set(LANGUAGE_KEY, language);
    },
    setLocal (state, local) {
      state.local = local;
    },
    setLocal4antd (state, local) {
      state.local4antd = local;
    }
  },
  actions: {
    loadLanguage ({ commit }, language = transLanguage(Cookies.get(LANGUAGE_KEY))) {
      const lang = transLanguage(language);
      commit('setLanguage', lang);
      commit('setLocal', getPrimaryTag(lang));
      const filePath = toAntD(language);
      import(`ant-design-vue/lib/locale-provider/${filePath}`).then(res => {
        commit('setLocal4antd', res.default || {});
      });
      moment.locale(toMoment(language));
      return language;
    },
  }
};