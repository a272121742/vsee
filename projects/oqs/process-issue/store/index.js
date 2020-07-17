import api from '../api.js';

export default {
  state: {

  },
  actions: {
    // 列表
    getTableList (store, payload) {
      return api.getTableList(payload);
    },
    // 导出
    getExportData (store, payload) {
      return api.getExportData(payload);
    },

    // 编辑
    eidtShowData (store, payload) {
      return api.eidtShowData(payload);
    },
    // 删除
    deleteList (store, payload) {
      return api.deleteList(payload);
    },
    /**
     * 创建
     */
    // 保存
    postSaveReport (store, payload) {
      return api.postSaveReport(payload);
    },

    // 保存并立项
    postSaveAndIrsR (store, payload) {
      return api.postSaveAndIrsR(payload);
    },
    /**
     * 修改
     */
    putSaveReport (store, payload) {
      return api.putSaveReport(payload);
    },

  },
};
