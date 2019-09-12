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
  strict: true,
  // 基本状态信息
  state: {
    /**
     * 内容是否刷新
     */
    contentRefresh: false,
    /**
     * 是否包含登陆模块（根据模块加载，如果包含登陆模块，则为`true`值）
     */
    allowLogin: !!modules.login,
    /**
     * 权限信息（列表）
     */
    permissions: [],
    /**
     * 菜单信息
     */
    menus: [],
    /**
     * 工作流状态
     */
    workflows: [],
    /**
     * 用户信息
     */
    userInfo: {},
    /**
     * 用户配置信息
     */
    configInfo: {},
    /**
     * 系统平台信息
     */
    systemInfo: {},
    /**
     * 登录令牌
     */
    token: Cookies.get('login_token'),
    /**
     * 语言信息（默认中文）
     */
    language: Cookies.get('language') || 'zh_CN'
  },
  getters: {
    /**
     * 获取全部授权信息
     */
    getPermissions (state) {
      return () => state.permissions;
    },
    /**
     * 判断是否拥有权限
     * @param {*} path - 权限路径，例如：`'sys:user:save'`，对应系统配置-用户菜单-保存操作
     */
    hasPermission (state) {
      return path => !!~state.permissions.indexOf(path);
    },
    /**
     * 获取全部菜单列表
     */
    getMenus (state) {
      return () => state.menus;
    },
    /**
     * 判断是否包含列表
     */
    hasMenu (state) {
      return menu => !!~state.menus.indexOf(menu);
    },
    /**
     * 获取所有工作流
     */
    getWorkflows (state) {
      return () => state.workflows;
    },
    /**
     * 判断是否包含工作流
     */
    hasWorkflow (state) {
      return wf => !!~state.menus.indexOf(wf);
    },
    /**
     * 获取授权令牌
     */
    getToken (state) {
      return () => Cookies.get('login_token');
    },
    /**
     * 获取系统信息
     */
    getSystem (state) {
      return () => state.systemInfo;
    },
    /**
     * 获取用户信息
     */
    getUser (state) {
      return () => state.userInfo;
    },
    /**
     * 获取用户配置信息
     */
    getConfig (state) {
      return () => state.configInfo;
    },
    /**
     * 获取语言信息
     */
    getLanguage (state) {
      return () => Cookies.get('language') || 'zh_CN';
    }
  },
  mutations: {
    /**
     * 设置权限
     * @param Array permissions - 权限（从服务端获取）
     */
    setPermissions (state, permissions) {
      state.permissions = permissions;
    },
    /**
     * 设置菜单
     * @param Array menus - 菜单（从服务端获取）
     */
    setMenus (state, menus) {
      state.menus = menus;
    },
    /**
     * 设置工作流
     * @param Array workflows - 工作流（从服务端获取）
     */
    setWorkflows (state, workflows) {
      state.workflows = workflows;
    },
    /**
     * 设置系统信息
     * @param Object systemInfo - 系统信息（从服务端获取）
     */
    setSystem (state, systemInfo) {
      state.systemInfo = systemInfo;
    },
    /**
     * 设置用户信息
     * @param Object userInfo - 用户信息（从服务端获取）
     */
    setUser (state, userInfo) {
      state,userInfo = userInfo;
    },
    /**
     * 设置配置信息
     * @param Object configInfo - 配置信息（从服务端获取）
     */
    setConfig (state, configInfo) {
      state.configInfo = configInfo;
    },
    /**
     * 设置语言信息
     */
    setLanguage (state, language) {
      state.language = language;
      Cookies.set('language', language);
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
     * 加载语言信息
     */
    loadLanguage ({getters, commit}) {
      const language = getters.getLanguage();
      commit('setLanguage', language);
      return language;
    },
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