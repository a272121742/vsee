import { MODULE_DYNAMIC_CACHE } from '~/config.js';
import { getModuleDynamicCache } from '~~/model.js';

export default {
  // 设置模块动态缓存
  [MODULE_DYNAMIC_CACHE] (state, payload) {
    console.log('payload', payload);
    if (payload) {
      Object.assign(state[MODULE_DYNAMIC_CACHE], payload);
    } else {
      state[MODULE_DYNAMIC_CACHE] = getModuleDynamicCache();
    }
  }
};
