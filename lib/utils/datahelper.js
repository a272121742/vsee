/**
 * 用于数据结构转换
 */

import { tryCatch, always, forEachObjIndexed, map, forEach, pipe, indexBy, prop, omit, ifElse, identity, pick, merge, objOf, curry, converge, compose } from 'ramda';


export const uuid = _ => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c=> c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);

export const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
};

/**
 * 线性列表转换为树
 * @param {*} list - 待转换的列表
 * @param {*} id - 列表项中的id键名
 * @param {*} pid - 列表项目中的关联父节点id的键名
 */
export const list2tree = function (list, id = 'id', pid = 'parentId') {
  function exists (list, parentId) {
    return !!~list.findIndex(item => item[id] === parentId);
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
        if (node.children) {
          node.children.push(row);
        } else {
          node.children = [row];
        }
        toDo.push(row);
      }
    }
  }
  return nodes;
};

/**
 * 将string转为对象
 * @param {*} defaults 
 */
const string2default = defaults => tryCatch(JSON.parse, always(defaults));

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

/**
 * entries(单kv对象构成的map)转list
 * @param {*} obj 
 * @param {String} key
 */
export const entries2list = prop => obj => {
  const result = [];
  forEachObjIndexed((value, key) => {
    if (prop) {
      value[prop] = key;
    }
    result.push(value);
  }, obj)
  return result;
};

/**
 * list转entries
 * @param {*} key - 转换的键名 
 * @param {*} reserved - 是否保留键名
 * @param {Array} list - 待转换的list
 */
export const list2entries = (key, reserved = true) => pipe(
  // 通过指定`key`构建map
  indexBy(prop(key)),
  // 如果标注保留，则保留key，否则移除
  ifElse(always(reserved), identity, map(omit([key])))
);

/**
 * `json`数据转换成`key-value`列表
 * @param {*} keyName - 键名
 * @param {*} valueName - 值名
 * @param {*} includes - 包含属性
 * @param {*} obj - 对象
 */
export const json2kvlist = ({keyName = 'key', valueName = 'value', filters = [], included = false}) => pipe(
  // 选择或排除包含的属性
  included ? pick(filters) : omit(filters),
  // 获取键值对数组
  Object.entries,
  // 遍历键值对，重构数组项
  map(([key, value]) => merge(objOf(keyName, key), objOf(valueName, value)))
);

/**
 * `json`数据按照预定义`props`属性配置进行转换
 * @param {*} props - 属性配置
 * @param {*} keyName - 键名
 * @param {*} valueName - 值名
 * @param {*} obj - 对象
 * @old TODO:这个方法暂时有问题，待修复
 */
const json2mapEntries = ({props = {}, keyName = 'key', valueName = 'value'}) => obj => {
  const result = [];
  forEachObjIndexed((value, key) => {
    if (props.hasOwnProperty(key)) {
      result.push(merge(objOf(keyName, props[key]), objOf(valueName, value)));
    }
  }, obj);
  return result;
}

/**
 * 映射JSON
 * @param {*} mapping 
 */
export const mappingJson = mapping => obj => {
  const result = {};
  forEachObjIndexed((value, key) => {
    if (mapping.hasOwnProperty(key)) {
      result[mapping[key]] = value;
    } else {
      result[key] = value;
    }
  },obj);
  return result;
};

/**
 * 复制Object的键值， 返回复制后的对象
 * @curried
 * @param {String} sourceKey - 源键名
 * @param {String} targetKey - 目标键名
 */
export const copyKey = curry((sourceKey, targetKey) => converge(
  // 3. 合并对象（合并1.*和2的操作）
  merge, [
    pipe(
      // 1.1 获取源键值
      prop(sourceKey), 
      // 1.2 创建新键名的单键值对
      objOf(targetKey)
    ), 
    // 2. 原对象返回
    identity
  ]
));

/**
 * 重命名Object的键名
 * @curried
 * @param {String} oldKey -  旧键名
 * @param {String} newKey -  新键名
 */
export const renameKey = curry((oldKey, newKey) => converge(
  // 3. 合并对象（合并1.*和2的操作）
  merge, [
    // 2. 删除旧键
    omit([oldKey]), 
    pipe(
      // 1.1 获取旧键值
      prop(oldKey),
      // 1.2 创建新键值对对象
      objOf(newKey)
    )
  ]
));

/**
 * 深度冻结对象
 */
const isObject = val => val && typeof val === 'object';
export const deepFreeze = obj => {
  if (isObject(obj) && !Object.isFrozen(obj)) {
    Object.keys(obj).forEach(key => deepFreeze(obj[key]));
    Object.freeze(obj);
  }
  return obj;
}