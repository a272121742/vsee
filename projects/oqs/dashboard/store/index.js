import api from '../api.js';

export default {
  state: {},
  actions: {
    // 表格
    getBoardList (store, payload) {
      return api.getBoardList(payload);
    },

    // 数据更新时间
    getTime (store, payload) {
      return api.getTime(payload);
    },
  },
};
