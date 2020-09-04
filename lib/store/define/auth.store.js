import Vue from 'vue';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
import { string2object, getUUID } from '@util/datahelper.js';
import $ from '@http';
import config from '~/config.js';

const {
  TOKEN_KEY = 'login_token',
  LOGIN_CACHE_KEY = 'cache_login_info',
  AUTH_LOGIN_API = {},
  AUTH_LOGOUT_API = {},
  TOKEN_CUSTSET = false,
  SKIP_LOGIN = false,
  PORTAL_PATH = '/',
} = config;

const allowLogin = SKIP_LOGIN ? false : require.context('~', true, /^\.\/login\/view\/[Ll]ogin\.vue/).keys().length === 1;

export default {
  state: {
    // 是否包含登录模块
    allowLogin,
    // 是否已经登录
    isLogin: !!Cookies.get(TOKEN_KEY),
    uuid: getUUID(),
    token: Cookies.get(TOKEN_KEY),
  },
  getters: {
    isLogin: () => () => !!Cookies.get(TOKEN_KEY),
    // 获取用户登陆缓存信息
    getLoginCache: () => () => string2object(Base64.decode(Cookies.get(LOGIN_CACHE_KEY) || '')),
    getUUID: (state) => () => state.uuid,
    getToken: (state) => () => state.token,
  },
  mutations: {
    // 仅设置Token，不做任何处理
    setToken: (state, token = '') => {
      state.token = token;
      Cookies.set(TOKEN_KEY, token);
    },
    // 设置Token同时，处理登录状态
    setLoginStatus: (state, token = '') => {
      state.isLogin = !!token;
      if (state.isLogin) {
        state.token = token;
        Cookies.set(TOKEN_KEY, token);
      } else {
        state.token = null;
        Cookies.remove(TOKEN_KEY);
      }
    },
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
  },
  actions: {
    login ({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        if (AUTH_LOGIN_API.URL) {
          const api = AUTH_LOGIN_API.URL;
          const data = AUTH_LOGIN_API.PARAMS || {};
          $.post(api, { ...data, ...loginInfo }).then((res) => {
            if (res.token) {
              if (!TOKEN_CUSTSET) {
                commit('setLoginStatus', res.token);
              }
            }
            Vue.nextTick(() => {
              resolve(res);
            });
          }).catch(reject);
        } else {
          reject(new Error('未配置登录接口'));
        }
      });
    },
    logout ({ state, commit }, flag = false) {
      return new Promise((resolve, reject) => {
        if (!state.isLogin || !state.isProd) {
          if (flag) {
            const api = AUTH_LOGOUT_API.URL;
            const data = AUTH_LOGOUT_API.PARAMS || {};
            $.post(api, data).then((res) => {
              resolve(res);
            }).finally(() => {
              Vue.nextTick(() => {
                commit('setToken');
              });
            });
          } else {
            commit('setToken');
            window.location.replace(PORTAL_PATH);
          }
        } else if (state.isProd && AUTH_LOGOUT_API.URL) {
          const api = AUTH_LOGOUT_API.URL;
          const data = AUTH_LOGOUT_API.PARAMS || {};
          $.post(api, data).then((res) => {
            resolve(res);
          }).finally(() => {
            Vue.nextTick(() => {
              commit('setToken');
            });
          });
        } else {
          reject(new Error('未配置登出接口'));
        }
      });
    },
    loadUUID ({ commit }) {
      commit('setUUID');
    },
  },
};
