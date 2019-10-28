import Vue from 'vue';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
import $ from '@lib/ajax.js';
import { string2object, getUUID } from '@util/datahelper.js';
import {
  TOKEN_KEY,
  LOGIN_CACHE_KEY,
  AUTH_API
} from '~/config.js';

/**
 * 设置登陆信息，如果传入token，则登录，否则登出
 * @param {*} state - 状态树
 * @param {*} token - 令牌
 */
const setLoginToken = (state, token = '') => {
  state.isLogin = !!token;
  if (state.isLogin) {
    state.token = token;
    Cookies.set(TOKEN_KEY, token);
  } else {
    state.token = null;
    Cookies.remove(TOKEN_KEY);
  }
};

export default {
  state: {
    // 是否包含登录模块
    allowLogin: true,
    // 是否已经登录
    isLogin: !!Cookies.get(TOKEN_KEY),
    uuid: getUUID(),
    token: Cookies.get(TOKEN_KEY)
  },
  getters: {
    isLogin: () => () => !!Cookies.get(TOKEN_KEY),
    // 获取用户登陆缓存信息
    getLoginCache: () => () => string2object(Base64.decode(Cookies.get(LOGIN_CACHE_KEY) || '')),
    getUUID: state => () => state.uuid,
    getToken: state => () => state.token
  },
  mutations: {
    setLoginStatus: setLoginToken,
    // 缓存用户登陆信息以记住用户名密码
    cacheLoginInfo (store, userInfo) {
      Cookies.set(LOGIN_CACHE_KEY, Base64.encode(JSON.stringify(userInfo)), { expires: 7 });
    },
    // 清除用户登陆信息
    cleanLoginInfo () {
      Cookies.remove(LOGIN_CACHE_KEY);
    },
    setUUID (state) {
      state.uuid = getUUID();
    },
    setToken: setLoginToken
  },
  actions: {
    login ({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        if (AUTH_API && AUTH_API.login) {
          const api = AUTH_API.login;
          $.post(api, loginInfo).then(res => {
            if (res.token) {
              commit('setLoginStatus', res.token);
            }
            Vue.nextTick(() => {
              resolve(res);
            });
          }).catch(reject);
        } else {
          reject('未配置登录接口');
        }
      });
    },
    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        if (AUTH_API && AUTH_API.logout) {
          const api = AUTH_API.logout;
          $.post(api).finally(() => {
            Vue.nextTick(() => {
              commit('setToken');
            });
          });
        } else {
          reject('未配置登出接口');
        }
      });
    },
    loadUUID ({ commit }) {
      commit('setUUID');
    }
  }
};