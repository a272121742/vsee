/**
 * 用于数据结构转换
 */

import {
  tryCatch, map, path, omit, curry, clone, assocPath, dissocPath, hasPath,
} from 'ramda';
import { hasOwnProperty } from './logic-helper.js';

/**
 * 线性列表转换为树
 * @param {*} list - 待转换的列表
 * @param {*} id - 列表项中的id键名
 * @param {*} pid - 列表项目中的关联父节点id的键名
 */
export const list2tree = function (list, id = 'id', pid = 'parentId', children = 'children') {
  function exists (arr, parentId) {
    return !!~arr.findIndex((item) => item[id] === parentId);
  }
  const nodes = [];
  for (let i = 0; i < list.length; i += 1) {
    const row = list[i];
    if (!exists(list, row[pid])) {
      nodes.push(row);
    }
  }
  const toDo = [];
  for (let i = 0; i < nodes.length; i += 1) {
    toDo.push(nodes[i]);
  }
  while (toDo.length) {
    const node = toDo.shift();
    for (let i = 0; i < list.length; i += 1) {
      const row = list[i];
      if (row[pid] === node[id]) {
        if (hasOwnProperty(children, node)) {
          node[children].push(row);
        } else {
          node[children] = [row];
        }
        toDo.push(row);
      }
    }
  }
  return nodes;
};

/**
 * 树转线性列表
 * @param {*} tree - 待转换的树结构数据
 * @param {*} children - 子节点集的键名，默认为`children`
 */
export const tree2list = function (tree = [], children = 'children') {
  return tree.reduce((list, item) => {
    list.push(omit([children], item));
    if (item[children] && item[children].length) {
      list.push(...tree2list(item.children));
    }
    return list;
  }, []);
};

const string2default = (defaults) => tryCatch(JSON.parse, () => clone(defaults));

const string2json = string2default(Object.create(null));
const string2array = string2default([]);
const string2any = string2default();

const convert = curry((fn = Function.prototype, before) => (fn instanceof Function ? fn(clone(before)) : before));

const ck = (sourceKey, targetKey) => (before) => {
  if (targetKey && typeof targetKey === 'string' && isHashMap(before) && hasOwnProperty(sourceKey, before)) {
    const after = clone(before);
    after[targetKey] = clone(before[sourceKey]);
    return after;
  }
  return before;
};
const ckPath = (sourcePath = '', targetPath = '') => (before) => {
  if (isHashMap(before) && typeof sourcePath === 'string' && typeof targetPath === 'string') {
    const sourceKeys = sourcePath.split('.');
    const targetKeys = targetPath.split('.');
    if (hasPath(sourceKeys, before)) {
      const value = path(sourceKeys);
      const after = clone(before);
      return assocPath(targetKeys, value, after);
    }
    return before;
  }
  return before;
};
const rk = (sourceKey, targetKey) => (before) => {
  if (targetKey && typeof targetKey === 'string' && isHashMap(before) && hasOwnProperty(sourceKey, before)) {
    const after = clone(before);
    after[targetKey] = clone(before[sourceKey]);
    delete after[sourceKey];
    return after;
  }
  return before;
};
const rkPath = (sourcePath = '', targetPath = '') => (before) => {
  if (isHashMap(before) && typeof sourcePath === 'string' && typeof targetPath === 'string') {
    const sourceKeys = sourcePath.split('.');
    const targetKeys = targetPath.split('.');
    if (hasPath(sourceKeys, before)) {
      const value = path(sourceKeys);
      const after = dissocPath(sourceKeys, clone(before));
      return assocPath(targetKeys, value, after);
    }
    return before;
  }
  return before;
};

function isHashMap (val) {
  return !!val && ['object', 'function'].includes(typeof val);
}
function freeze (before) {
  const obj = clone(before);
  if (isHashMap(obj)) {
    Object.keys(Object.getOwnPropertyDescriptors(obj)).forEach((key) => freeze(obj[key]));
    Object.freeze(obj);
  }
  return obj;
}

function clearObserver (before) {
  const obj = clone(before);
  if (isHashMap(obj)) {
    Object.keys(Object.getOwnPropertyDescriptors(obj)).forEach((key) => clearObserver(obj[key]));
    delete obj.__ob__;
  }
  return obj;
}

/**
 * 获取对象深度属性，通过`a.b.c`的方式
 */
export const attr = curry((spliter = '.', propPath, obj) => path(propPath.split(spliter), obj));

/**
 * 树过滤
 * @curried
 * @param Function fn -  过滤函数，返回`Boolean类型`
 * @param Array tree -  树对象，数组类型，`root`类型的树直接传children
 */
// export const treeFilter = curry((fn, tree) => filter(fn, map((item) => ({ ...item, ...(item.children ? { children: treeFilter(fn, item.children) } : {}) }), tree)));

/**
 * 通过表达式在树中进行搜索，搜索顺序为从根到叶（左查询）
 */
// export const treeFind = (fn, tree) => alt(find(fn), compose(treeFind(fn), unnest, map(prop('children'))))(tree);
// export const treeFind = (fn, tree) => {
//   const out = { result: void 0 };
//   out.result = find(fn, tree);
//   if (out.result !== void 0) {
//     return out.result;
//   }
//   for (let i = 0; i < tree.length; i += 1) {
//     const node = tree[i];
//     if (node.children && node.children.length) {
//       out.result = treeFind(fn, node.children);
//       if (out.result !== void 0) {
//         break;
//       }
//     }
//   }
//   return out.result;
// };

export const treeTransform = curry((fn, tree) => map(fn, map((item) => ({ ...item, ...(item.children ? { children: treeTransform(fn, item.children) } : {}) }), tree)));
/**
 * 映射字段，从右至左
 * @param {*} mapping
 */
export const keyMapFrom = (mapping) => (item) => {
  const keys = Object.keys(mapping);
  const result = clone(item);
  keys.forEach((key) => {
    result[key] = mapping[key] instanceof Function ? mapping[key](item) : item[mapping[key]];
    delete result[mapping[key]];
  });
  return result;
};
/**
 * 映射字段，从左至右
 * @param {*} mapping
 */
export const keyMapTo = (mapping) => (item) => {
  const keys = Object.keys(mapping);
  const result = clone(item);
  keys.forEach((key) => {
    result[mapping[key]] = item[key];
    delete result[key];
  });
  return result;
};
/**
 * 转换对象，从右至左
 * @param {*}} mapping
 */
export const transform = curry((mapping, item) => {
  const keys = Object.keys(mapping);
  const result = {};
  keys.forEach((key) => {
    result[key] = mapping[key] instanceof Function ? mapping[key](item) : item[mapping[key]];
  });
  return keys.length ? result : item;
});
/**
 * 转换对象，从左至右
 * @param {*}} mapping
 */
export const transto = curry((mapping, item) => {
  const keys = Object.keys(mapping);
  const result = {};
  keys.forEach((key) => {
    result[mapping[key]] = item[key];
  });
  return result;
});

/**
 * 服务断数据结构
 * ['a', 'b', 'c', 'd', 'e', ...]
 * [a1,  b1,  c1,  d1,  e1,  ...]
 * [a2,  b2,  c2,  d2,  e2,  ...]
 * [a3,  b3,  c3,  d3,  e3,  ...]
 * 通过数据提取，转换为echarts可用source结构
 * @param Object config - 转换配置
 * {
 *    reverse:  // 反转矩阵，默认`false`；
 *    series:   // 序列下标或名称，默认`0`；
 *    xAxis:    // `x轴`下标或名称，默认`0`；
 *    yAxis:    // `y轴`下标或名称，默认`0`， 也可是是数组；
 *    title:    // 数据源的标题，即`source[0][0]`的值，默认`'-'`；
 *    unhead:   // 是否无头数据，即表头，默认`false`表示有表头；
 * }
 * @param Array list - 转换的数组（二维数组）
 */
export const tablePick = (config = {}) => (list = []) => {
  const { reverse = false, unhead = false } = config;
  const names = list[0] || [];
  let { series = 0, xAxis = 0, yAxis = 0 } = config;
  if (typeof series === 'string' && names.includes(series)) {
    series = [names.indexOf(series)];
  } else if (series instanceof Array) {
    series = series.map((item) => (typeof item === 'string' ? names.indexOf(item) : item));
  } else if (typeof series !== 'number') {
    throw new Error('series未能成功匹配到');
  }
  if (typeof xAxis === 'string' && names.includes(xAxis)) {
    xAxis = names.indexOf(xAxis);
  } else if (typeof xAxis !== 'number') {
    throw new Error('xAxis未能成功匹配到');
  }
  if (typeof yAxis === 'string' && names.includes(yAxis)) {
    yAxis = names.indexOf(yAxis);
  } else if (typeof yAxis !== 'number') {
    throw new Error('yAxis未能成功匹配到');
  }
  const result = list.reduce(({ ln, l0 }, row, index, { length }) => {
    if (index || unhead) {
      const cs = series.map((y) => row[y]);
      let cx = reverse ? row[xAxis] : row[yAxis];
      cx = cx === void 0 ? null : cx;
      let cy = reverse ? row[yAxis] : row[xAxis];
      cy = cy === void 0 ? null : cy;
      if (hasOwnProperty(cy, ln)) {
        ln[cy].push(...cs);
      } else {
        ln[cy] = [cy, ...cs];
      }
      if (!l0.includes(cx)) {
        series.forEach(() => l0.push(cx));
      }
    }
    return index === length - 1 ? [l0, ...Object.values(ln)] : { ln, l0 };
  }, { ln: {}, l0: [config.title || '-'] });
  return result;
};

export {
  string2json,
  string2array,
  string2any,
  convert,
  freeze,
  clearObserver,
  ck,
  rk,
  ckPath,
  rkPath,
};
