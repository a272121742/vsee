import {
  curryN, invoker, clone, defaultTo, identity, reverse as reverseArray,
} from 'ramda';
import { isArrayLike } from 'lodash';

const noop = () => {};

const defaultBy = (fn = identity, def) => (value) => (fn(clone(value)) ? value : def);

const gather = (fn) => (argsArr) => fn(...argsArr);

const spread = (fn) => (...args) => fn(args);

const reverse = (fn) => {
  if (fn instanceof Function) {
    return (...args) => fn([].reverse.call(args));
  }
  if (isArrayLike(fn)) {
    return reverseArray(fn);
  }
  throw new Error('参数必须是函数或者数组');
};

const tapclone = (fn) => (value) => [value, fn(clone(value))][0];

const alt = (f1 = noop, f2 = noop) => (value) => defaultTo(f2(clone(value)), f1(clone(value)));

const altBy = (fn = identity, f1 = noop, f2 = noop) => (value) => defaultBy(fn, f2(value))(f1(clone(value)));

const seq = (...fns) => (...vals) => [].forEach.call(fns, (fn = noop) => fn.apply(fn, vals));

const seqClone = (...fns) => (...vals) => [].map.call(fns, (fn = noop) => fn.apply(fn, clone(vals)));

/**
 * 控制反转函数
 * @param {*} obj - 移交控制权限的对象
 * @param {String} method - 控制方法
 * @param {Array} ...args - 传递参数
 * eg: invokCall('log', '消息', '-', '提示信息')(console);
 */
const invokeCall = curryN(2, (methodName, ...args) => invoker(args.length, methodName)(...args));

/**
 * 控制反转函数
 * @param {*} obj - 移交控制权限的对象
 * @param {String} method - 控制方法
 * @param {Array} args - 传递参数
 * eg: R.invokApply('log', ['消息', '-', '提示信息'])(console)
 */
const invokeApply = curryN(2, (methodName, args) => invoker(args.length, methodName)(...args));

export {
  defaultBy,
  gather,
  spread,
  reverse,
  tapclone,
  alt,
  altBy,
  seq,
  seqClone,
  invokeCall,
  invokeApply,
};
