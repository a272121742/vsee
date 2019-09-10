// router-snapshot.js
// https://github.com/dankogai/js-base64
import { Base64 } from 'js-base64';
import { hasPath, path as pathValue, lensPath, set } from 'ramda';

function beforeRouteEnterHandler (vm, {key, ext, path}) {
  // 获取路由绑定字段
  const routeBindKeys = vm.$options[ext] || [];
  // 获取路由绑定部分的加密字符串
  const routeParamsString = vm.$route ? vm.$route.query[key] : '';
  // 解密并转换为JSON
  let routeParamsJSON;
  try {
    routeParamsJSON = JSON.parse(Base64.decode(routeParamsString));
  }catch (e) {
    routeParamsJSON = {};
  }
  routeBindKeys.forEach(attr => {
    // 切割属性，形成列表
    const pathArr = attr.split('.');
    path && pathArr.unshift(path);
    // 获取根对现货
    const rootObj = pathArr.length === 1 ? vm : pathValue(pathArr.slice(0, -1), vm);
    // 获取目标属性名
    const attrName = pathArr.length === 1 ? attr : pathArr.slice(-1)[0];
    // 使用vue的是指方式，若浏览器没有缓存值，则获取组件默认值
    vm.$set(rootObj, attrName, hasPath(pathArr, routeParamsJSON) ? pathValue(pathArr, routeParamsJSON) : pathValue(pathArr, vm));
    // 追加属性反向监听，监听到的属性变化都会呈现在路由上
    vm.$watch(pathArr.join('.'), (value) => {
      // 获取路由的queyr部分
      const query = vm.$route.query;
      // 转换成快照值
      let routeSnapshotValueJSON;
      try {
        routeSnapshotValueJSON = JSON.parse(Base64.decode(query[key]));
      }catch (e) {
        routeSnapshotValueJSON = {};
      }
      // 更新值
      const newValue = set(lensPath(pathArr), value, routeSnapshotValueJSON)
      const extendQuery = {};
      extendQuery[key] = Base64.encodeURI(JSON.stringify(newValue));
      vm.$router.push({
        query: {
          ...query,
          ...extendQuery
        }
      })
    }, {
      deep: true
    });
  })
}

export default {
  install (Vue, {key = '_', ext = 'routeshot', path = ''} = {}) {
    Vue.mixin({
      created () {
        beforeRouteEnterHandler(this, {key, ext, path});
      }
    });
  }
}
export function RouterSnapshot ({key = '_', ext = 'routeshot', path = ''} = {}) {
  return {
    created () {
      beforeRouteEnterHandler(this, {key, ext, path});
    }
  }
}
