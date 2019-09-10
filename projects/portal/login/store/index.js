
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
import api from '../api.js';
import { string2object } from '@util/datahelper.js';

export default {
  state: {
    isLogin: !!Cookies.get('login_token')
  },
  getters: {
    getCache () {
      const cache = Base64.decode(Cookies.get('cache_login_info') || '');
      return string2object(cache);
    }
  },
  mutations: {
    cache (store, userInfo) {
      Cookies.set('cache_login_info', Base64.encode(JSON.stringify(userInfo)));
    },
    clean () {
      Cookies.remove('cache_login_info');
    }
  },
  actions: {
    login (store, loginInfo) {
      return api.login(loginInfo);
    },
  }
};
