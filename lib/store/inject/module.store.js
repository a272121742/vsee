import Vue from 'vue';
import { forEachObjIndexed, clone } from 'ramda';
import { hasOwnProperty } from '@util/datahelper.js';

export default function (moduleExport = {}) {
  const moduleStore = clone(moduleExport);
  if (hasOwnProperty(moduleStore, 'state')) {
    if (!hasOwnProperty(moduleStore, 'getters')) {
      moduleStore.getters = {};
    }
    moduleStore.getters.getInitiallyState = () => () => moduleExport.state;
    if (!hasOwnProperty(moduleStore, 'mutations')) {
      moduleStore.mutations = {};
    }
    // 填充（还原其他属性，设置当前属性）
    moduleStore.mutations.reset =
    moduleStore.mutations.fill =
    moduleStore.mutations.fillState = (state, payload = {}) => {
      forEachObjIndexed((value, key) => {
        if (hasOwnProperty(payload, key)) {
          Vue.set(state, key, payload[key]);
        } else {
          Vue.set(state, key, clone(moduleExport.state[key]));
        }
      }, state);
    };
    // 设置（仅设置当前属性，不改变其他属性）
    moduleStore.mutations.update =
    moduleStore.mutations.set =
    moduleStore.mutations.setState = (state, payload = {}) => {
      forEachObjIndexed((value, key) => {
        if (hasOwnProperty(state, key)) {
          Vue.set(state, key, value);
        }
      }, payload);
    };
    // 还原（还原全部属性）
    moduleStore.mutations.init =
    moduleStore.mutations.initState = (state) => {
      forEachObjIndexed((value, key) => {
        if (hasOwnProperty(moduleExport.state, key)) {
          Vue.set(state, key, clone(moduleExport.state[key]));
        }
      }, state);
    };
  }
  return moduleStore;
}