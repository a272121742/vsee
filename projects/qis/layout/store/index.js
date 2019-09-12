import api from '../api.js';

export default {
  state: {
  },
  getters: {
    
  },
  mutations: {
   
  },
  actions: {
    /**
     * 获取系统信息
     */
    getSystemInfo ({commit}) {
      api.getSystemInfo && api.getSystemInfo().then(systemInfo => {
        commit('setSystem', systemInfo, {root: true});
      });
    },
    /**
     * 获取用户信息
     */
    getUserInfo ({commit}) {
      api.getUserInfo && api.getUserInfo().then(userInfo => {
        commit('setUser', userInfo, {root: true});
      });
    },
    /**
     * 获取配置信息
     */
    getConfigInfo () {
      api.getConfigInfo && api.getConfigInfo().then(configInfo => {
        commit('setConfig', configInfo, {root: true});
      });
    },
    /**
     * 获取授权信息
     */
    getPermissions ({commit}) {
      api.getPermissions && api.getPermissions().then(permissions => {
        commit('setPermissions', permissions, {root: true});
      });
    },
    /**
     * 获取菜单信息
     */
    getMenus ({commit}) {
      api.getMenus && api.getMenus().then(menus => {
        commit('setMenus', menus, {root: true});
      });
    },
    /**
     * 获取工作流信息
     */
    getWorkflows ({commit}) {
      api.getWorkflows && api.getWorkflows().then(workflows => {
        commit('setWorkflows', workflows, {root: true});
      })
    }
  }
};
