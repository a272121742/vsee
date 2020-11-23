import { Story, Preview, Meta, Props } from '@storybook/addon-docs/blocks';

<Meta title="框架/工具（Util）/数据助理（datahelper）" />

# 数据助理

主要负责进行数据转换，虽然我们推荐直接使用函数式编程中的经典库`Ramda`和`lodash`，但我们仍然补充了一些常见的方法以弥补他们的不足。

在我们的业务模型中，常见的数据类型有：

1. map （以`key: value`方式组成的键值对集群，例如`{id: 1, name: '张三'}`）;
1. list/array (以`[v1, v2, ...]`方式组成的数组，例如`[10, 20, 30, 40]`);
1. tree (`list`中每一项都带有子集`children`对象，例如`{name: 'root', children: [{name: 'item1'}, {name: 'item2'}]}`，这种情况一般是单根树，如果是多根树，都会默认认为所有根的根为一个空对象);
1. entry（类似list，但数组的长度为2，分别是`key`和`value`）；
1. tuple（类似list，但数组中每一项类型不确定）；
1. meta（类似list，但数组中每一项都是字符串，用于表示`table`的元信息）；
1. matrix/table（矩阵，二维list，但子数组的每一项必须是单值类型）；
1. string（字符串，但保留着数据类型，例如`'{"key": "value"}'`或`'[10, 20, 30, 40]'`）

在我们的业务模型中，常见的数据转换有：

1. string ---> list/map
1. list --> tree
1. tree --> list
1. map -->  entries
1. entries --> map
1. list --> map
1. list --> meta_table
1. list --> table

## 集合操作

针对`list`的多样性，我们给他进行类似Java泛型的命名方式，分为如下几类：

1. tuple - 元祖，数组中每一项类型固定；
1. meta - 数组中每一项必须为`String`，即`List<String>`；
1. entry - 数组长度为2， 且索引`0`类型必须为`String`;
1. listT - item为tuple类型，`List<Tuple>`的缩写；
1. listE - item为entry类型，`List<Entry>`的缩写；
1. listM - item为map类型，`List<Map>`的缩写；

### 【❌】listM2tree

将线性列表`List<Map>`，按照指定规则转换为树，方法签名为：

```javascript
/**
 * 线性列表转换为树
 * @param {*} list - 待转换的列表
 * @param {*} id - 列表项中的id键名，默认为`'id'`
 * @param {*} pid - 列表项目中的关联父节点id的键名，默认为`'pid'`
 * @param {*} children - 生成的子节点集的键名，默认为`'children'`
 */
export const listM2tree = ({id = 'id', pid = 'parentId', children = 'children'} = {}, list = []) => {};

// 例如：
const list = [
  {id: 1, name: 'root'}, 
  {id: 2, name: 'item1', pid: 1},
  {id: 3, name: 'item2', pid: 1},
];
const tree = listM2tree({}, list);
/**
 *  tree: {
 *    id: 1,
 *    name: 'root',
 *    children: [{id: 2, name: 'item1', pid: 1}, {id: 3, name: 'item2', pid: 1}]
 *  }
 */
```

### 【❌】listE2map

将`List<Entry>`转换为一个键值对`Map`，方法签名为：

```javascript
export const listE2map = (list) => {};
```

### 【❌】listM2map

将`List<Map>`转换为一个新键值对`Map`，方法签名为：

```javascript
export const listM2map = ({ key } = {}, list) => {};
```

## 键值对操作

### 【❌】ck

将一个对象的键进行复制（copy-key），方法签名为：

```javascript
/**
 * 复制Object的键值， 返回复制后的对象
 * @param {String} source - 源键名；
 * @param {String} target - 目标键名；
 * @param {Boolean} clone - 是否克隆值，默认`true`；
 */
export const ck = ({ source, target, clone = true }, obj) => {};

// 例如
const source = {root: {name: 'root'}};
const newSource1 = ck({source: 'root', target: 'parent'});
/**
 *  newSource1: 
 *  {
 *    root: {name: 'root'},
 *    parent: {name: 'root'},
 *  }
 */
const newSource2 = ck({source: 'root', target: 'parent', clone: false});
/**
 *  newSource2: 
 *  {
 *    root: {name: 'root'},
 *    parent: {name: 'root'},
 *  }
 */
```

第三个参数`clone`主要针对对象引用，上例中，`newSource1`和`newSource2`最大的区别就在于，如果改变`newSource2.root.name`，则`newSource2.parent.name`也会发生变化，他们的上层是处于引用关系传递的。

### 【❌】rk

将一个对象的键进行重命名（rename-key），方法签名为：

```javascript
/**
 * 重命名Object的键值， 返回重命名后的对象
 * @param {String} source - 源键名；
 * @param {String} target - 目标键名；
 * @param {Boolean} clone - 是否克隆值，默认`true`；
 */
export const rk = (source, target, clone = true) => (obj) => {};

// 例如
const source = {root: {name: 'root'}};
const newSource = ck({source: 'root', target: 'parent'});
/**
 *  newSource:
 *  {
 *    parent: {name: 'root'},
 *  }
 */
```

## 树操作

### 【❌】tree2list

将树结构，按照指定规则转换为线性列表，方法签名为：

```javascript
export const tree2list = ({ children = 'children' }, tree) => {};
```

## 字符操作

### 【❌】string2json

将字符串转换为一个JSON格式的对象，如果无法转换，将默认转换为`{}`，方法签名为：

```javascript
/**
 * 字符串转JSON
 * @param {*} str
 * @return Object - 若无法转换，则返回为`{}`
 */
export const string2json = function (str) {};

// 例如：
const rightStr = '{"key": "value"}';
console.log(string2json(rightStr));  // => {key: value}
const errorStr = '{key: value}';
console.log(string2json(errorStr));  // => {} // 转换失败
```

### 【❌】string2array

将字符串转换为一个数组，如果无法转换，将默认转换为`[]`，方法签名为：

```javascript
/**
 * 字符串转Array
 * @param {*} str
 * @return Object - 若无法转换，则返回为`[]`
 */
export const string2array = function (str) {};

// 例如
const rightStr = '[10, 20, 30, 40]';
console.log(string2json(rightStr));  // => [10, 20, 30, 40]
const errorStr = "['10', '20', '30', '40']";
console.log(string2json(errorStr));  // => [] // 转换失败
```

### 【❌】string2object

将字符串转换为一个任意对象，如果无法转换，将默认转换为`undefined`，方法签名为：

```javascript
/**
 * 字符串转Object
 * @param {*} str
 * @return Object - 若无法转换，则返回为`undefined`
 */
export const string2object = function (str) {};

// 例如
const rightStr = '{"key": "value"}';
console.log(string2json(rightStr));  // => {key: value}
const errorStr = '{key: value}';
console.log(string2json(errorStr));  // => undefined // 转换失败
```

## 其他操作

### 【❌】freeze

冻结对象，这里我们提供的是对`Object.freeze`的封装，并且做了深度处理，方法签名为：

```javascript
/**
 * 深度冻结对象
 */
export const freeze = (obj) => {};
```

### 【❌】tablePick

将带有meta信息的table数据进行拾取特定列，转换成所需要的新table（echarts的srouce字段所需），方法签名为：

```javascript
/**
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
export const tablePick = (config = {}, list = []) => {};

// 案例
const data = [
  ['year', 'factory', 'number', 'avg', 'base'], 
  ['2015', '一厂',     43.3,     50,    0    ], 
  ['2015', '二厂',     85.8,     50,    0    ],
  ['2015', '三厂',     93.7,     55,    0    ], 
  ['2016', '一厂',     83.1,     45,    0    ],
  ['2016', '二厂',     73.4,     40,    0    ], 
  ['2016', '三厂',     55.1,     25,    0    ],
  ['2017', '一厂',     86.4,     50,    0    ], 
  ['2017', '二厂',     65.2,     40,    0    ],
  ['2017', '三厂',     82.5,     35,    0    ],
];
const source = tablePick({series: [2, 3, 4], xAxis: 1, yAxis: 0})(data);
/**
 * source: [
 *   [ '-',   '一厂',  '一厂',  '一厂',  '二厂',  '二厂', '二厂',  '三厂', '三厂', '三厂' ],
 *   ['2015',  43.3,   50,     0,      85.8,    50,    0,      93.7,   55,     0    ],
 *   ['2016',  83.1,   45,     0,      73.4,    40,    0,      55.1,   25,     0    ],
 *   ['2017',  86.4,   50,     0,      65.2,    40,    0,      82.5,   35,     0    ],
 * ]
 */
```







