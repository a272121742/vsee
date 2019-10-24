import { MODULE_DYNAMIC_CACHE } from '~/config.js';
import { getModuleDynamicCache } from '~~/model.js';

export default {
  state: {
    [MODULE_DYNAMIC_CACHE]: getModuleDynamicCache()
    // advanceSearchFormRecord: {},
    // searchFormAdvanced: false
  },
  // 设置模块动态缓存
  [MODULE_DYNAMIC_CACHE] (state, payload) {
    if (payload) {
      Object.assign(state[MODULE_DYNAMIC_CACHE], payload);
    } else {
      state[MODULE_DYNAMIC_CACHE] = getModuleDynamicCache();
    }
  }
};
