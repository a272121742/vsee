import {
  omit, length, curry, identity, clone,
} from 'ramda';
import { hasOwnProperty, isSafeArray, hasSafeChildren } from './logic-helper.js';

const DEFAULT_ID_NAME = 'id';
const DEFAULT_PID_NAME = 'pid';
const DEFAULT_CHILDREN_NAME = 'children';

/**
 * 广度优先遍历（BFS） iterator
 */
function treeEach (iterator, ...params) {
  let childrenName = DEFAULT_CHILDREN_NAME;
  const [eachTree] = params;
  const eacher = (tree, ...args) => {
    if (isSafeArray(tree)) {
      const [parent = null, path = []] = args;
      tree.forEach((node, index) => {
        iterator(node, index, [...path, index], parent, tree);
        if (hasSafeChildren(childrenName, node)) {
          eacher(node[childrenName], node, [...path, index]);
        }
      });
    }
  };
  eacher.config = ({ children = DEFAULT_CHILDREN_NAME } = {}) => {
    childrenName = children;
  };
  return eachTree ? eacher(eachTree) : eacher;
}

function treeMap (mapping, ...params) {
  let childrenName = DEFAULT_CHILDREN_NAME;
  const [eachTree] = params;
  const mapper = (tree, ...args) => {
    if (isSafeArray(tree)) {
      const [parent = null, path = []] = args;
      return tree.map((node, index) => Object.assign(mapping(node, index, [...path, index], parent, tree), hasSafeChildren(childrenName, node) ? { [childrenName]: mapper(node[childrenName], omit([childrenName], node), [...path, index]) } : void 0));
    }
    return [];
  };
  mapper.config = ({ children = DEFAULT_CHILDREN_NAME } = {}) => {
    childrenName = children;
  };
  return eachTree ? mapper(eachTree) : mapper;
}

function treeReduce (accumulator, initValue, ...params) {
  let childrenName = DEFAULT_CHILDREN_NAME;
  const result = clone(initValue);
  const [reduceTree] = params;
  const reducer = (tree, ...args) => {
    if (isSafeArray(tree)) {
      const [ret = { result }, parent = null, path = []] = args;
      tree.forEach((node, index) => {
        ret.result = accumulator(ret.result, node, index, [...path, index], parent, tree);
        if (hasSafeChildren(childrenName, node)) {
          reducer(node[childrenName], ret, omit([childrenName], node), [...path, index]);
        }
      });
      return ret.result;
    }
    return initValue;
  };
  reducer.config = ({ children = DEFAULT_CHILDREN_NAME } = {}) => {
    childrenName = children;
  };
  return reduceTree ? reducer(reduceTree, { result }) : reducer;
}

// const tree = [
//   {
//     id: '1',
//     title: '节点1',
//     children: [
//       {
//         id: '1-1',
//         title: '节点1-1',
//       },
//       {
//         id: '1-2',
//         title: '节点1-2',
//       },
//     ],
//   },
//   {
//     id: '2',
//     title: '节点2',
//     children: [
//       {
//         id: '2-1',
//         title: '节点2-1',
//       },
//     ],
//   },
// ];

const list2tree = curry(({
  id = DEFAULT_ID_NAME, pid = DEFAULT_PID_NAME, children = DEFAULT_CHILDREN_NAME, keepChildren = false,
} = {}, list = []) => {
  if (isSafeArray(list)) {
    const info = list.reduce((map, node) => {
      map[node[id]] = node;
      return map;
    }, {});
    return list.filter((node) => {
      if (keepChildren && !hasOwnProperty(children, node)) {
        node[children] = [];
      }
      if (hasOwnProperty(node[pid], info)) {
        const item = info[node[pid]];
        if (!hasOwnProperty(children, item)) {
          item[children] = [];
        }
        item[children].push(node);
      }
      return !node[pid];
    });
  }
  return [];
});

const tree2list = curry(({ children = DEFAULT_CHILDREN_NAME, keepChildren = false } = {}, tree = []) => {
  if (isSafeArray(tree)) {
    const convert = keepChildren ? identity : omit([children]);
    return tree.reduce((list, node) => {
      list.push(convert(node));
      if (hasOwnProperty(children, node) && length(node[children])) {
        list.push(...tree2list({ children, keepChildren }, node[children]));
      }
      return list;
    }, []);
  }
  return [];
});

// export const treeFilter = curry((fn, tree) => filter(fn, map((item) => ({ ...item, ...(item.children ? { children: treeFilter(fn, item.children) } : {}) }), tree)));

function treeFilter (filter, ...params) {
  let childrenName = DEFAULT_CHILDREN_NAME;
  const [filterTree] = params;
  const filtration = (tree = [], ...args) => {
    if (isSafeArray(tree)) {
      const [parent = null, path = []] = args;
      return clone(tree).filter((node, index) => {
        node[childrenName] = filtration(node[childrenName], node, [...path, index]);
        if (!hasSafeChildren(childrenName, node)) {
          delete node[childrenName];
        }
        return filter(node, index, [...path, index], parent, tree);
      });
    }
    return [];
  };
  filtration.config = ({ children = DEFAULT_CHILDREN_NAME } = {}) => {
    childrenName = children;
  };
  return filterTree ? filtration(filterTree) : filtration;
}

function treeFind (selector, ...params) {
  let childrenName = DEFAULT_CHILDREN_NAME;
  const [selectTree] = params;
  const selection = (tree = [], ...args) => {
    if (isSafeArray(tree)) {
      const entries = Object.entries(tree);
      const [parent = null, path = []] = args;
      for (let i = 0; i < entries.length; i += 1) {
        const [indexStr, node] = entries[i];
        const index = parseInt(indexStr, 10);
        if (selector(node, index, [...path, index], parent, tree)) {
          return node;
        }
        if (hasSafeChildren(childrenName, node)) {
          const res = selection(node[childrenName], node, [...path, index]);
          if (res) return res;
        }
      }
    }
    return null;
  };
  selection.config = ({ children = DEFAULT_CHILDREN_NAME } = {}) => {
    childrenName = children;
  };
  return selectTree ? selection(selectTree) : selection;
}

function treePostFind () {

}

function treeFindLast () {

}

function treePostFindLast () {

}

export {
  treeEach,
  treeMap,
  treeReduce,
  tree2list,
  list2tree,
  treeFilter,
  treeFind,
  treePostFind,
  treeFindLast,
  treePostFindLast,
};

/**
 * 深度优先遍历（DFS）
 * 1. 先序遍历（pre）
 * 2. 后序遍历（post）
 */
