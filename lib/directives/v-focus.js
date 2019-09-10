import Vue from 'vue';

Vue.directive('focus', {
  inserted (el, binding, vnode, oldVnode) {
    // 如果是`input`标签，则自动聚焦
    if (el.tagName === 'INPUT') {
      el.focus();
    }
  }
});
