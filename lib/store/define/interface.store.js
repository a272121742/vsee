import $ from '@http';
import { GLOBAL_API } from '~/config.js';

const globalApiActions = {};

for (const name in GLOBAL_API) {
  const actionName = buildMethodName('fetch', name);
  globalApiActions[actionName] = (store, query = {}) => new Promise((resolve, reject) => {
    if (GLOBAL_API && GLOBAL_API[name] && GLOBAL_API[name][0]) {
      const api = GLOBAL_API[name][0];
      const param = GLOBAL_API[name][1] || {};
      const setName = buildMethodName('set', name);
      $.get(api, { ...param, ...query }).then((res) => {
        store.commit(setName, res);
        resolve(res);
      }).catch(reject);
    } else {
      reject(`未配置的API: ~/config.js GLOBAL_API.${name}`);
    }
  });
}

function buildMethodName (method, name = '') {
  return method + name.slice(0, 1).toUpperCase() + name.slice(1);
}

export default {
  actions: globalApiActions,
};
