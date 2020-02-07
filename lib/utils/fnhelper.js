/**
 * 用户函数的辅助工具
 */
import {
  curryN, invoker, clone, defaultTo,
} from 'ramda';

const nothing = () => {};

/**
 * 参数收缩
 * @param {Function} fn - 原函数，接受不定参数
 * @return {Function} fn - 返回函数，接受参数列表
 */
export const gather = (fn) => (argsArr) => fn(...argsArr);

/**
 * 参数展开
 * @param {Function} fn - 原函数，接受参数列表
 * @return {Function} fn - 返回函数，接受不定参数
 */
export const spread = (fn) => (...args) => fn(args);

/**
 * 参数反转
 * @param {Function} fn - 原函数，接受参数列表
 * @return {Function} fn - 返回函数，接受反转后的参数列表
 */
export const reverse = (fn) => (...args) => fn([].reverse.call(args));

/**
 * 断开原有数据连接的tap组合子，函数式编程中调试特别有用
 * @param {*} fn
 */
// eslint-disable-next-line no-sequences
export const tapclone = (fn) => (value) => (fn(clone(value)), value);

/**
 * 交替组合子
 * @param {*} f1
 * @param {*} f2
 */
export const alt = (f1 = nothing, f2 = nothing) => (value) => defaultTo(f2(value), f1(value));

/**
 * 同时组合子
 * @param {Array<Function>} fns 指定函数列表同时执行
 */
export const seq = (...fns) => (...vals) => [].forEach.call(fns, (fn = nothing) => fn.apply(fn, vals));

/**
 * 控制反转函数
 * @param {*} obj - 移交控制权限的对象
 * @param {String} method - 控制方法
 * @param {Array} ...args - 传递参数
 * eg: R.invokCall('log', '消息', '-', '提示信息')(console);
 */
export const invokeCall = curryN(2, (methodName, ...args) => invoker(args.length, methodName)(...args));

/**
 * 控制反转函数
 * @param {*} obj - 移交控制权限的对象
 * @param {String} method - 控制方法
 * @param {Array} args - 传递参数
 * eg: R.invokApply('log', ['消息', '-', '提示信息'])(console)
 */
export const invokeApply = curryN(2, (methodName, args) => invoker(args.length, methodName)(...args));

// /**
//  * 在某个时间范围内，将几次操作合并为最后一次操作
//  */
// export const debounce = (fn, delay) => {
//   // 设定计时器
//   var timer = null;
//   return function _ (...args) {
//     var context = this;
//     var doNow = !timer;
//     // 如果存在计时器，则清理之前的任务
//     if (timer) {
//       clearTimeout(timer);
//     }
//     // 延时执行任务后清空定时器
//     timer = setTimeout(() => {
//       timer = null;
//     }, delay);
//     // 如果第一次进入，则立马执行
//     if (doNow) {
//       fn.apply(context, args);
//     }
//   };
// };

// /**
//  * 一定时间中只触发一次，无论该函数触发的有多频繁；
//  */
// export const throttle = (fn, delay) => {
//   var timer = null;
//   var startTime = Date.now();
//   return function _ (...args) {
//     var currTime = Date.now();
//     // 计算出两次触发的时间间隔有没有大于delay
//     var remaining = delay - (currTime - startTime);
//     var context = this;
//     clearTimeout(timer);
//     if (remaining <= 0) {
//       // 如果两次触发时间大于delay，则立马触发一次任务函数并且更新起始时间戳
//       fn.apply(context, args);
//     } else {
//       // 如果两次触发时间小于delay， 则改变定时器时间保证delay时间一定触发任务函数
//       timer = setTimeout(fn, remaining);
//     }
//   };
// };
