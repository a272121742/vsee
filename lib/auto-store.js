/* eslint-disable no-shadow */
/**
 * 自动加载所有存在的路由
 */
import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';

import { autoRequires, excludeModules } from '@@/config.js';

const modules = storeExport(autoRequires, excludeModules);

Vue.use(Vuex)

const storeConfig = {
  // 严格模式
  strict: process.env.NODE_ENV !== 'production',
  // 基本状态信息
  state: {
    /**
     * 内容是否刷新
     */
    contentRefresh: false,
    /**
     * 是否包含登陆模块
     */
    allowLogin: !!modules.login,
    // /**
    //  * 是否包含辅助模块
    //  */
    // assistHelper: !!modules.assist,
    /**
     * 权限信息
     */
    permissions: [],
    // // 是否正在登陆
    // isLoading: false,
    
    // // 登陆的用户信息
    // userInfo: {}
    token: Cookies.get('login_token'),
    user: {}
  },
  getters: {
    /**
     * 获取授权信息
     */
    getPermissions (state) {
      return () => state.permissions;
    },
    /**
     * 判断是否拥有权限
     * @param {*} path - 权限路径，例如：`'sys:user:save'`，对应系统配置-用户菜单-保存操作
     */
    hasPermission (state) {
      return function (path) {
        return !!~state.permissions.indexOf(path);
      }
    },
    getToken (state) {
      return () => Cookies.get('login_token');
    },
    getUser (state) {
      return () => state.user;
    },
  },
  mutations: {
    /**
     * 设置权限
     * @param {*} state 
     * @param {*} permissions 
     */
    setPermission (state, permissions) {
      state.permissions = permissions;
    },
    /**
     * 设置用户信息
     */
    setUser (state, user) {
      state,user = user;
    },
    /**
     * 设置刷新
     * @param {*} state 
     * @param {*} value 
     */
    setContentRefresh (state, value) {
      state.contentRefresh = value;
    },
  },
  actions: {
    
    /**
     * 刷新接口
     */
    refresh ({state, commit}) {
      if (!state.contentRefresh) {
        commit('setContentRefresh', true);
        Vue.nextTick(() => {
          commit('setContentRefresh', false);
        });
      }
    }
  },
  modules
}
const store = new Vuex.Store(storeConfig);

export default store;

function storeExport (autoRequires, excludeModules) {
  // 匹配模块下的`./module-name/store/index.js`文件
  const req = autoRequires.store;

  // 导出所有路由的default部分
  const storeModules = {};
  req
    .keys()
    .filter(path => !~excludeModules.indexOf(path.split('/')[1]))
    .forEach(mod => {
      const moduleNames = mod.split(/\//)[1]
      const moduleExport = req(mod).default || {}
      moduleExport.namespaced = true
      storeModules[moduleNames] = moduleExport
    });
  return storeModules
}