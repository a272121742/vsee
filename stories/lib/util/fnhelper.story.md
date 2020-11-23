import { Story, Preview, Meta, Props } from '@storybook/addon-docs/blocks';

<Meta title="框架/工具（Util）/函数助理（fnhelper）" />

# 函数助理

主要负责进行函数处理或转换，属于组合子范畴，虽然我们推荐直接使用函数式编程中的经典库`Ramda`和`lodash`，但我们仍然补充了一些常见的方法以弥补他们的不足。

对于函数流程的处理，我们分为：

- nothing （不做任何处理）；
- identity （`Ramda`提供）；
- clone （`Ramda`提供）；
- or （交替数据或者交替行为）；
- fork （分流处理）；
- join （聚集处理）；
- map （映射处理）；
- reduce （规约处理）；


## 维度变换

### gather

将原先发散的不定参数，聚合成收缩的单参数形式，方法签名如下：

```javascript
/**
 * 参数收缩
 * @param {Function} fn - 原函数，接受不定参数
 * @return {Function} fn - 返回函数，接受参数列表
 */
export const gather = (fn) => (argsArr) => {};

// 例如
// 原函数`console.log`支持不定参数，现在我们来将参数收敛，类似`apply`，但不改变绑定对象
const log = gather(console.log);
log(['【警告】', '数据异常', 40001]);
const max = gather(Math.max);
max([1,2,4,3]);  // => 3
```

### spread

将原先聚合收缩但单参数形式，发散成展开的不定参数形式，方法签名如下：

```javascript
/**
 * 参数展开
 * @param {Function} fn - 原函数，接受参数列表
 * @return {Function} fn - 返回函数，接受不定参数
 */
export const spread = (fn) => (...args) => {};

// 例如
// 原函数`Promise.all`接受单参数数组，不支持不定参数，现在我们来将参数展开，类似`call`，但不改变绑定对象
var promiseAll = spread(Promise.all);
promiseAll(promiseA, promiseB, promiseC);
```

### reverse

反转原参数的调用过程，方法签名如下：

```javascript
/**
 * 参数反转
 * @param {Function} fn - 原函数，接受参数列表
 * @return {Function} fn - 返回函数，接受反转后的参数列表
 */
export const reverse = (fn) => (...args) => {};
```

## 流程处理

### defaultBy

`Ramda`提供了`defaultTo`函数，用于祛除不合法返回值（`null`、`undefined`、`NaN`），有时，为了能增加不合法数据的范围，此方法就不具备扩展性了。因此，我们提供了`defaultBy`方法， 可以定义一个返回`Boolean`的函数以实现自定义数据判断。方法签名如下：

```javascript
/**
 * `defaultTo`函数升级版，按照特定逻辑判断是否取该值
 * @param {Function} fn - 判断函数，返回`Boolean`类型；
 * @param {*} def - 默认值；
 * eg: defaultBy(isValiDate, Date.now());
 */
export const defaultBy = (fn = identity, def) => (value) => (fn(value) ? value : def);

// 例如
// 判断是否为空对象
const isEmptyObj = (value) => Object.keys(value).length;
// 获取对象，如果是空对象，返回`null`
const getObj = defaultBy(isEmptyObj, null);
// 获取值
const infoObj = getObj(info);  // 如果info为空对象，则返回`null`，否则返回原对象
```

### tapClone

`tap`组合子的拓展，原`tap`组合子会拦截数据，但如果数据是引用类型，则会产生引用传递的问题。如果不希望发生引用传递，除了在给定参数时使用`clone`，更好方式是使用`tapClone`。方法签名如下：

```javascript
/**
 * 断开原有数据连接的tap组合子，函数式编程中调试特别有用，该函数拓展
 * @param {*} fn
 */
export const tapClone = (fn) => (value) => {};
```

### alt

`alt`是`defaultTo`的函数版升级，先对参数做`f2`的取值判断，如果数据不合规范，则返回预定义函数`f1`的值。方法签名如下：

```javascript
/**
 * 交替组合子
 * @param {Function} targetFn - 目标处理函数，默认值`nothing`
 * @param {Function} defaultFn - 目标处理函数处理的数据不合规时，采用默认处理函数处理，默认值`nothing`
 * @param {*} value - 需要处理的值
 */
export const alt = (targetFn = nothing, defaultFn = nothing) => (value) => {};
```

### altBy

`altBy`是`alt`的升级版，模式同`defaultBy`一样，会有额外的函数去判断返回值是否合规。方法签名如下：

```javascript
/**
 * 交替组合子
 * @param {Function} predicateFn - 谓词函数，返回数据是否合规，默认值`identity`
 * @param {Function} targetFn - 目标处理函数，默认值`nothing`
 * @param {Function} defaultFn - 目标处理函数处理的数据不合规时，采用默认处理函数处理，默认值`nothing`
 */
export const altBy = (fn = identity, f1 = nothing, f2 = nothing) => (value) => defaultBy(fn, f2(clone(value)))(f1(clone(value)));
```

### seq

将参数按照函数队列进行同时执行，并将返回参数结果按照原队列进行返还。方法签名如下：

```javascript
/**
 * 同时组合子
 * @param {Array<Function>} fns - 函数队列
 * @param {*} value - 值
 */
export const seq = (...fns) => (value) => {};
```

### invokeCall

`invoker`函数的扩展，用于实现控制反转功能。方法签名如下：

```javascript
/**
 * 控制反转函数
 * @param {*} obj - 移交控制权限的对象
 * @param {String} method - 控制方法
 * @param {Array} ...args - 传递参数
 * eg: R.invokCall('log', '消息', '-', '提示信息')(console);
 */
export const invokeCall = (method, ...args) => (obj) => {};
```

### invokeApply

`invoker`函数的扩展，用于实现控制反转功能。方法签名如下：

```javascript
/**
 * 控制反转函数
 * @param {*} obj - 移交控制权限的对象
 * @param {String} method - 控制方法
 * @param {Array} args - 传递参数
 * eg: R.invokApply('log', ['消息', '-', '提示信息'])(console)
 */
export const invokeApply = (method, args) => (obj) => {};
```