import Cookies from 'js-cookie';
import { LANGUAGE_KEY, LANGUAGE_DEFAULT } from '~/config.js';

const EMPTY_LANGUATE = 'zh_CN';
export default {
  state: {
    language: Cookies.get(LANGUAGE_KEY) || LANGUAGE_DEFAULT || EMPTY_LANGUATE
  },
  getters: {
    getLanguage: () => () => Cookies.get(LANGUAGE_KEY) || LANGUAGE_DEFAULT || EMPTY_LANGUATE
  },
  mutations: {
    setLanguage (state, language = LANGUAGE_DEFAULT || EMPTY_LANGUATE) {
      state.language = language;
      Cookies.set(LANGUAGE_KEY, language);
    },
    loadLanguage (state) {
      const language = Cookies.get(LANGUAGE_KEY) || LANGUAGE_DEFAULT || EMPTY_LANGUATE;
      state.language = language;
    }
  },
  actions: {
    loadLanguage ({ getters, commit }) {
      const language = getters.getLanguage();
      commit('setLanguage', language);
      return language;
    }
  }
};