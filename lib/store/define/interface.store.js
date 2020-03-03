import $ from '@http';
import config from '~/config.js';

const { GLOBAL_API_LIST = {} } = config;

const globalApiActions = {};

const apiKeys = Object.keys(GLOBAL_API_LIST);

apiKeys.forEach((name) => {
  const actionName = buildMethodName('fetch', name);
  globalApiActions[actionName] = (store, query = {}) => new Promise((resolve, reject) => {
    if (GLOBAL_API_LIST && GLOBAL_API_LIST[name] && GLOBAL_API_LIST[name][0]) {
      const api = GLOBAL_API_LIST[name][0];
      const param = GLOBAL_API_LIST[name][1] || {};
      const setName = buildMethodName('set', name);
      $.get(api, { ...param, ...query }).then((res) => {
        store.commit(setName, res);
        resolve(res);
      }).catch(reject);
    } else {
      reject(new Error(`未配置的API: ~/config.js GLOBAL_API_LIST.${name}`));
    }
  });
});

function buildMethodName (method, name = '') {
  return method + name.slice(0, 1).toUpperCase() + name.slice(1);
}

export default {
  actions: globalApiActions,
};
