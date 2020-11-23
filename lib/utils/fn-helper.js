import {
  curryN, invoker, clone, defaultTo, identity,
} from 'ramda';

function nothing () {}

const defaultBy = (fn = identity, def) => (value) => (fn(clone(value)) ? value : def);

const gather = (fn) => (argsArr) => fn(...argsArr);

const spread = (fn) => (...args) => fn(args);

const reverse = (fn) => (...args) => fn([].reverse.call(args));

const tapclone = (fn) => (value) => [value, fn(clone(value))][0];

const alt = (f1 = nothing, f2 = nothing) => (value) => defaultTo(f2(clone(value)), f1(clone(value)));

const altBy = (fn = identity, f1 = nothing, f2 = nothing) => (value) => defaultBy(fn, f2(value))(f1(clone(value)));

const seq = (...fns) => (...vals) => [].forEach.call(fns, (fn = nothing) => fn.apply(fn, vals));

const seqClone = (...fns) => (...vals) => [].map.call(fns, (fn = nothing) => fn.apply(fn, clone(vals)));

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
