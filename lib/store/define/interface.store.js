import $ from '@http';
import config from '~/config.js';

const DISABLED_NAMES = ['config', 'language', 'local'];
const { GLOBAL_API_LIST = {} } = config;

const globalState = {};
const globalGetters = {};
const globalMutations = {};
const globalApiActions = {};

const apiKeys = Object.keys(GLOBAL_API_LIST);

apiKeys.forEach((name) => {
  if (typeof name !== 'string') {
    throw new Error('全局接口名称不能为空：', name);
  }
  if (DISABLED_NAMES.includes(name)) {
    throw new Error('全局接口名不能占用系统名称：', name);
  }
  const apiConf = GLOBAL_API_LIST[name] || [];
  const api = apiConf[0];
  const param = apiConf[1] || {};
  const defaultValue = apiConf[2] || {};
  globalState[name] = defaultValue;
  globalState[buildMethodName('is', `${name}Loaded`)] = false;
  globalGetters[buildMethodName('get', name)] = (state) => () => state[name];
  globalGetters[buildMethodName('is', `${name}Loaded`)] = (state) => () => state[buildMethodName('is', `${name}Loaded`)];
  globalMutations[buildMethodName('set', name)] = (state, value) => {
    state[name] = value;
    state[buildMethodName('is', `${name}Loaded`)] = true;
  };
  globalApiActions[buildMethodName('fetch', name)] = (store, query = {}) => new Promise((resolve, reject) => {
    if (api) {
      const setName = buildMethodName('set', name);
      $.get(api, { ...param, ...query }).then((res = defaultValue) => {
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
  state: globalState,
  getters: globalGetters,
  mutations: globalMutations,
  actions: globalApiActions,
};
