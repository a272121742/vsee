import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { MODULE_DYNAMIC_CACHE } from '~/config.js';
import { getModuleDynamicCache } from '~~/model.js';

export default {
  state: {
    [MODULE_DYNAMIC_CACHE]: getModuleDynamicCache()
    // advanceSearchFormRecord: {},
    // searchFormAdvanced: false
  },
  getters,
  actions,
  mutations
};
