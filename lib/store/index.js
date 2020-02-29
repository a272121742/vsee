import Vue from 'vue';
import Vuex from 'vuex';
import inject from './inject/module.store.js';
import config from '~/config.js';

const { EXCLUDE_MODULES = [] } = config;

Vue.use(Vuex);
const rootStateReq = require.context('./define', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\.store\.js$/);
const rootState = {
  state: {}, getters: {}, mutations: {}, actions: {},
};
rootStateReq.keys().forEach((mod) => {
  const store = rootStateReq(mod).default || {};
  Object.assign(rootState.state, store.state);
  Object.assign(rootState.getters, store.getters);
  Object.assign(rootState.mutations, store.mutations);
  Object.assign(rootState.actions, store.actions);
});

const moduleStateReq = require.context('~', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\/store\/index\.js$/);
const storeModules = {};
moduleStateReq
  .keys()
  .filter((path) => !~EXCLUDE_MODULES.indexOf(path.split('/')[1]))
  .forEach((mod) => {
    const moduleNames = mod.split(/\//)[1];
    const moduleExport = moduleStateReq(mod).default || {};
    moduleExport.namespaced = true;
    storeModules[moduleNames] = inject(moduleExport);
  });

const storeConfig = {
  // 严格模式
  strict: process.env.NODE_ENV !== 'production',
  modules: storeModules,
  ...rootState,
};

const store = new Vuex.Store(storeConfig);

const watchStoreReq = require.context('./watch', true, /^\.\/[A-Za-z][A-Za-z0-9_-]*\.js$/);
watchStoreReq
  .keys()
  .forEach((mod) => {
    const watcher = watchStoreReq(mod).default || (() => {});
    watcher(store);
  });

window.opendebug = (key) => key === 'admin' && (store.commit('debug'), process.env);

export default store;
