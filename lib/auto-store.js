/**
 * 自动加载所有存在的路由
 */
import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
import {
  autoRequires,
  excludeModules,
  TOKEN_KEY,
  LANGUAGE_KEY,
  LANGUAGE_DEFAULT,
  LOGIN_CACHE_KEY
} from '@@/config.js';
import { string2object, getUUID } from '@util/datahelper.js';

Vue.use(Vuex);

const modules = storeExport(autoRequires, excludeModules);

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

const caseStore = [
  // 开发模式
  {
    state: {
      isTest: !!process.env.testing,
      isMock: !!process.env.mocking,
      isPro: process.env.NODE_ENV === 'production',
      isDev: process.env.NODE_ENV === 'development',
      isDebug: false,
    },
    getters: {
      // 是否是测试模式（测试模式下连接真实后端服务）
      isTest: () => () => !!process.env.testing,
      // 是否是模拟的数据
      isMock: () => () => !!process.env.mocking,
      // 是否线上环境
      isPro: () => () => process.env.NODE_ENV === 'production',
      // 是否开发环境
      isDev: () => () => process.env.NODE_ENV === 'development',
      getUrl: (state) => (url = '/') => {
        return (state.isPro ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI) + url;
      }
    },
    mutations: {
      debug(state) {
        state.isDebug = !state.isDebug;
      },
    },
  },
  // 刷新控制
  {
    state: {
      refresh: false, // 否刷新
    },
    mutations: {
      setRefresh(state, refresh = false) {
        state.refresh = refresh;
      },
    },
    actions: {
      /**
       * 刷新接口
       */
      refresh({ state, commit }) {
        if (!state.refresh) {
          commit('setRefresh', true);
          Vue.nextTick(() => {
            commit('setRefresh', false);
          });
        }
      },
    },
  },
  // 登陆数据
  {
    state: {
      // 是否包含登录模块
      allowLogin: !!modules.login,
      // 是否已经登录
      isLogin: !!Cookies.get(TOKEN_KEY),
    },
    getters: {
      isLogin: state => _ => !!Cookies.get(TOKEN_KEY),
      getLoginCache: state => (_) => {
        const cache = Base64.decode(Cookies.get(LOGIN_CACHE_KEY) || '');
        return string2object(cache);
      },
    },
    mutations: {
      setLoginStatus: setLoginToken,
      cacheLoginInfo(store, userInfo) {
        Cookies.set(LOGIN_CACHE_KEY, Base64.encode(JSON.stringify(userInfo)), { expires: 7 });
      },
      cleanLoginInfo() {
        Cookies.remove(LOGIN_CACHE_KEY);
      },
    },
    actions: {
      logout({ state, commit }) {
        commit('setToken');
        if (state.isPro) {
          window.location.href = '/';
        }
      },
    },
  },
  // 令牌数据
  {
    state: {
      uuid: getUUID(),
      token: Cookies.get(TOKEN_KEY),
    },
    getters: {
      getUUID: state => _ => state.uuid,
      getToken: state => _ => state.token,
    },
    mutations: {
      setUUID(state) {
        state.uuid = getUUID();
      },
      setToken: setLoginToken,
    },
    actions: {
      async loadUUID({ commit }) {
        commit('setUUID');
      },
    },
  },
  // 语言
  {
    state: {
      language: Cookies.get(LANGUAGE_KEY) || LANGUAGE_DEFAULT,
    },
    getters: {
      getLanguage: state => _ => Cookies.get(LANGUAGE_KEY) || LANGUAGE_DEFAULT,
    },
    mutations: {
      setLanguage(state, language = LANGUAGE_DEFAULT) {
        state.language = language;
        Cookies.set(LANGUAGE_KEY, language);
      },
    },
    actions: {
      loadLanguage({ getters, commit }) {
        const language = getters.getLanguage();
        commit('setLanguage', language);
        return language;
      },
    },
  },
  // 系统信息
  {
    state: {
      systemInfo: {},
    },
    getters: {
      getSystemInfo: state => _ => state.systemInfo,
    },
    mutations: {
      setSystem(state, systemInfo = {}) {
        state.systemInfo = systemInfo;
      },
    },
  },
  // 用户信息
  {
    state: {
      userInfo: {},
    },
    getters: {
      getUser: state => _ => state.userInfo,
    },
    mutations: {
      setUser(state, userInfo = {}) {
        state.userInfo = userInfo;
      },
    },
  },
  // 配置信息
  {
    state: {
      configInfo: {},
    },
    getters: {
      getConfig: state => _ => state.configInfo,
    },
    mutations: {
      setConfig(state, configInfo = {}) {
        state.configInfo = configInfo;
      },
    },
  },
  //  权限信息
  {
    state: {
      permissions: [],
    },
    getters: {
      getPermissions: state => _ => state.permissions,
      hasPermission: state => _ => !!~state.permissions.indexOf(_),
    },
    mutations: {
      setPermissions(state, permissions = []) {
        state.permissions = permissions;
      },
    },
  },
  // 菜单信息
  {
    state: {
      menus: [],
    },
    getters: {
      getMenus: state => _ => state.menus,
      hasMenu: state => _ => !!~state.menus.indexOf(_),
    },
    mutations: {
      setMenus(state, menus = []) {
        state.menus = menus;
      },
    },
  },
  // 工作流信息
  {
    state: {
      workflows: [],
    },
    getters: {
      getWorkflows: state => _ => state.getWorkflows,
      hasWorkflow: state => _ => !!~state.workflows.indexOf(_),
    },
    mutations: {
      setWorkflows(state, workflows = []) {
        state.workflows = workflows;
      },
    },
  },
];

const baseStore = caseStore.reduce((conf, item) => {
  const state = item.state || {};
  const getters = item.getters || {};
  const mutations = item.mutations || {};
  const actions = item.actions || {};
  // conf.state = mergeAll([conf.state, state]);
  // conf.getters = mergeAll([conf.getters, getters]);
  // conf.mutations = mergeAll([conf.mutations, mutations]);
  // conf.actions = mergeAll([conf.actions, actions]);
  conf.state = { ...conf.state, ...state };
  conf.getters = { ...conf.getters, ...getters };
  conf.mutations = { ...conf.mutations, ...mutations };
  conf.actions = { ...conf.actions, ...actions };
  return conf;
}, {
  state: {}, getters: {}, mutations: {}, actions: {},
});

const storeConfig = {
  // 严格模式
  strict: true,
  ...baseStore,
  modules,
};

const store = new Vuex.Store(storeConfig);

window.opendebug = key => key === 'qianlong' && store.commit('debug');

export default store;


function storeExport(autoReq, exclude) {
  // 匹配模块下的`./module-name/store/index.js`文件
  const req = autoReq.store;
  // 导出所有路由的default部分
  const storeModules = {};
  req
    .keys()
    .filter(path => !~exclude.indexOf(path.split('/')[1]))
    .forEach((mod) => {
      const moduleNames = mod.split(/\//)[1];
      const moduleExport = req(mod).default || {};
      moduleExport.namespaced = true;
      storeModules[moduleNames] = moduleExport;
    });
  return storeModules;
}
