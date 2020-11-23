import Vue from 'vue';
import { forEachObjIndexed, clone } from 'ramda';
import { hasOwnProperty } from '@util/logic-helper.js';

const nothing = function () {};

export default function module (moduleExport = {}) {
  const moduleStore = clone(moduleExport);
  if (hasOwnProperty('state', moduleStore)) {
    if (!hasOwnProperty('getters', moduleStore)) {
      moduleStore.getters = {};
    }
    moduleStore.getters.init = () => () => moduleExport.state;
    if (!hasOwnProperty('mutations', moduleStore)) {
      moduleStore.mutations = {};
    }
    // 还原（还原其他属性，设置当前属性）
    const init = (state, payload = {}) => {
      forEachObjIndexed((value, key) => {
        if (hasOwnProperty(key, payload)) {
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
        if (hasOwnProperty(key, state)) {
          Vue.set(state, key, value);
        }
      }, payload);
    };
    moduleStore.mutations.set = set;
    // // 还原（还原全部属性）
    // const init = (state) => {
    //   forEachObjIndexed((value, key) => {
    //     if (hasOwnProperty(key, moduleExport.state)) {
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
