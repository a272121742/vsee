/* eslint-disable no-plusplus */
/**
 * 用于数据结构转换
 */

import {
  tryCatch, always, forEachObjIndexed, map, path, pipe, indexBy, prop, omit, ifElse, identity, pick, merge, objOf, curry, converge, clone, filter, find,
} from 'ramda';
import { isArrayLikeObject, isObjectLike } from 'lodash';


/**
 * 判断是否拥有某个属性
 */
export const hasOwnProperty = curry((obj, property = '') => Object.prototype.hasOwnProperty.call(obj, property));

// export const getUUID = _ => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);

export const getUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16));

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
  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    if (!exists(list, row[pid])) {
      nodes.push(row);
    }
  }
  const toDo = [];
  for (let i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i]);
  }
  while (toDo.length) {
    const node = toDo.shift();
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (row[pid] === node[id]) {
        if (hasOwnProperty(node, children)) {
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

/**
 * 将string转为对象
 * @param {*} defaults
 */
const string2default = (defaults) => tryCatch(JSON.parse, always(defaults));

/**
 * 字符串转JSON
 * @param {*} str
 */
export const string2json = string2default({});
/**
 * 字符串转数组
 * @param {*} str
 */
export const string2array = string2default([]);
export const string2object = string2default();

// /**
//  * entries(单kv对象构成的map)转list
//  * @param {*} obj
//  * @param {String} key
//  */
// export const entries2list = (propName) => (obj) => {
//   const result = [];
//   forEachObjIndexed((value, key) => {
//     if (propName) {
//       value[propName] = key;
//     }
//     result.push(value);
//   }, obj);
//   return result;
// };

// /**
//  * list转entries
//  * @param {*} key - 转换的键名
//  * @param {*} reserved - 是否保留键名
//  * @param {Array} list - 待转换的list
//  */
// export const list2entries = (key, reserved = true) => pipe(
//   // 通过指定`key`构建map
//   indexBy(prop(key)),
//   // 如果标注保留，则保留key，否则移除
//   ifElse(always(reserved), identity, map(omit([key]))),
// );

/**
 * `json`数据转换成`key-value`列表
 * @param {*} keyName - 键名
 * @param {*} valueName - 值名
 * @param {*} includes - 包含属性
 * @param {*} obj - 对象
 */
export const json2kvlist = ({
  keyName = 'key', valueName = 'value', filters = [], included = false,
}) => pipe(
  // 选择或排除包含的属性
  included ? pick(filters) : omit(filters),
  // 获取键值对数组
  Object.entries,
  // 遍历键值对，重构数组项
  map(([key, value]) => merge(objOf(keyName, key), objOf(valueName, value))),
);

/**
 * `json`数据按照预定义`props`属性配置进行转换
 * @param {*} props - 属性配置
 * @param {*} keyName - 键名
 * @param {*} valueName - 值名
 * @param {*} obj - 对象
 * @old TODO:这个方法暂时有问题，待修复
 */
// export const json2mapEntries = ({ props = {}, keyName = 'key', valueName = 'value' }) => obj => {
//   const result = [];
//   forEachObjIndexed((value, key) => {
//     if (hasOwnProperty(props, key)) {
//       result.push(merge(objOf(keyName, props[key]), objOf(valueName, value)));
//     }
//   }, obj);
//   return result;
// };

/**
 * 映射JSON
 * @param {*} mapping
 */
export const mappingJson = (mapping) => (obj) => {
  const result = {};
  forEachObjIndexed((value, key) => {
    if (hasOwnProperty(mapping, key)) {
      result[mapping[key]] = value;
    } else {
      result[key] = value;
    }
  }, obj);
  return result;
};

/**
 * 复制Object的键值， 返回复制后的对象
 * @param {String} sourceKey - 源键名；
 * @param {String} targetKey - 目标键名；
 * @param {Boolean} clone - 是否克隆值，默认`true`；
 */
export const ck = (sk, tk, cp = true) => (obj) => {
  if (!hasOwnProperty(obj, sk)) throw new Error('源键名不存在');
  const cf = cp ? clone : identity;
  obj[tk] = cf(sk);
  return obj;
};
// @TODO: old,准备删除;
export const copyKey = curry((sourceKey, targetKey) => converge(
  // 3. 合并对象（合并1.*和2的操作）
  merge, [
    pipe(
      // 1.1 获取源键值
      prop(sourceKey),
      // 1.2 创建新键名的单键值对
      objOf(targetKey),
    ),
    // 2. 原对象返回
    identity,
  ],
));


/**
 * 复制Object的键值， 返回复制后的对象
 * @param {String} sourceKey - 源键名；
 * @param {String} targetKey - 目标键名；
 * @param {Boolean} clone - 是否克隆值，默认`true`；
 */
export const rk = (sk, tk, cp = true) => (obj) => {
  if (!hasOwnProperty(obj, sk)) throw new Error('源键名不存在');
  const cf = cp ? clone : identity;
  obj[tk] = cf(sk);
  return omit([sk], obj);
};
// @TODO: old,准备删除;
export const renameKey = curry((oldKey, newKey) => converge(
  // 3. 合并对象（合并1.*和2的操作）
  merge, [
    // 2. 删除旧键
    omit([oldKey]),
    pipe(
      // 1.1 获取旧键值
      prop(oldKey),
      // 1.2 创建新键值对对象
      objOf(newKey),
    ),
  ],
));


/**
 * 深度冻结对象
 */
const isObject = (val) => val && typeof val === 'object';
export const freeze = (obj) => {
  if (isObject(obj) && !Object.isFrozen(obj)) {
    Object.keys(obj).forEach((key) => freeze(obj[key]));
    Object.freeze(obj);
  }
  return obj;
};

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
export const treeFilter = curry((fn, tree) => filter(fn, map((item) => ({ ...item, ...(item.children ? { children: treeFilter(fn, item.children) } : {}) }), tree)));

/**
 * 通过表达式在树中进行搜索，搜索顺序为从根到叶（左查询）
 */
// export const treeFind = (fn, tree) => alt(find(fn), compose(treeFind(fn), unnest, map(prop('children'))))(tree);
export const treeFind = (fn, tree) => {
  const out = { result: void 0 };
  out.result = find(fn, tree);
  if (out.result !== void 0) {
    return out.result;
  }
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children && node.children.length) {
      out.result = treeFind(fn, node.children);
      if (out.result !== void 0) {
        break;
      }
    }
  }
  return out.result;
};

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
 * 清理Observer
 */
export const clearObserver = (obj) => (isObjectLike(obj)
  ? Object.assign(isArrayLikeObject(obj) ? [] : {}, obj)
  : (obj || {}));

// obj instanceof Object ? Object.assign(obj instanceof Array ? [] : {}, obj) : obj;

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
      if (Object.hasOwnProperty.call(ln, cy)) {
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
