import Vue from 'vue';

// 拖拽排序插件 https://segmentfault.com/a/1190000008209715?utm_source=tag-newest
import Sortable from 'sortablejs';

Vue.directive('sortable', {
  bind (el, binding, vnode, oldVnode) {
    console.log('v-sortable bind', {
      el, binding, vnode, oldVnode,
    });
    const vm = vnode.context;
    const options = { ...binding.value };
    console.log(binding.value.data);
    // 绑定上下文
    if (binding.value.onEnd && binding.value.onEnd instanceof Function) {
      options.onEnd = binding.value.onEnd.bind(vnode.context);
    }
    // 如果存在拖拽元素，则绑定拖拽元素，否则绑定组件自己
    if (el.querySelector(binding.value.el)) {
      vm.sortable = Sortable.create(el.querySelector(binding.value.el), options);
    } else {
      vm.sortable = Sortable.create(el, options);
    }
  },
  inserted (el, binding, vnode, oldVnode) {
    // console.log('v-sortable inserted', {el, binding, vnode, oldVnode});
  },
  update (el, binding, vnode, oldVnode) {
    // console.log('v-sortable update', {el, binding, vnode, oldVnode});
  },
  componentUpdated (el, binding, vnode, oldVnode) {
    // console.log('v-sortable componentUpdated', {el, binding, vnode, oldVnode});
  },
  unbind (el, binding, vnode, oldVnode) {
    // console.log('v-sortable unbind', {el, binding, vnode, oldVnode});
  },
});
