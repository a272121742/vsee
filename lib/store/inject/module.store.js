import Vue from 'vue';
import { forEachObjIndexed, clone } from 'ramda';
import { hasOwnProperty } from '@util/datahelper.js';

const nothing = function () {};

export default function (moduleExport = {}) {
  const moduleStore = clone(moduleExport);
  if (hasOwnProperty(moduleStore, 'state')) {
    if (!hasOwnProperty(moduleStore, 'getters')) {
      moduleStore.getters = {};
    }
    moduleStore.getters.init = () => () => moduleExport.state;
    if (!hasOwnProperty(moduleStore, 'mutations')) {
      moduleStore.mutations = {};
    }
    // 还原（还原其他属性，设置当前属性）
    const init = (state, payload = {}) => {
      forEachObjIndexed((value, key) => {
        if (hasOwnProperty(payload, key)) {
          Vue.set(state, key, payload[key]);
        } else {
          Vue.set(state, key, clone(moduleExport.state[key]));
        }
      }, state);
    };
    moduleStore.mutations.init = init;
    // 设置（仅设置当前属性，不改变其他属性）
    const set = (state, payload = {}) => {
      forEachObjIndexed((value, key) => {
        if (hasOwnProperty(state, key)) {
          Vue.set(state, key, value);
        }
      }, payload);
    };
    moduleStore.mutations.set = set;
    // // 还原（还原全部属性）
    // const init = (state) => {
    //   forEachObjIndexed((value, key) => {
    //     if (hasOwnProperty(moduleExport.state, key)) {
    //       Vue.set(state, key, clone(moduleExport.state[key]));
    //     }
    //   }, state);
    // };
    moduleStore.mutations.init = init;
    // 自定义更新
    const update = (state, fn = nothing) => {
      fn.call(moduleStore, state);
    };
    moduleStore.mutations.update = update;
  }
  return moduleStore;
}
