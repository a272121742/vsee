import Vue from 'vue';

/**
 * 权限控制指令
 */
Vue.directive('permission', (el, binding, vnode) => {
  if (el) {
    // 先设置元素隐藏，避免出现闪现
    el.style.display = 'none';
    const path = binding.value || '';
    const store = vnode && vnode.context && vnode.context.$store;
    // 如果权限存在，则显示元素
    if (store.getters.hasPermission(path)) {
      el.style.display = '';
    } else {
      // 如果权限不存在，可能是由于网络导致资源未加载完毕，因此监听权限属性
      store.watch((state) => state.permissions, (permissions) => {
        // 如果权限属性仍然没有，删除
        if (!~permissions.indexOf(path)) {
          vnode.context.$nextTick(() => {
            vnode.elm.remove();
            el.remove();
          });
        } else {
          // 反之元素保留
          el.style.display = '';
        }
      });
    }
  }
});
