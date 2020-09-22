import aspect from '../aspect.js';
import cflow from './cflow.js';

const nothoing = () => {};

/**
 * 环绕通知（执行之前到返回之前），可拦截参数
 */
export default function around (fn = nothoing, flow) {
  const callback = flow ? cflow(fn) : fn;
  return {
    around (...args) {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      const obj = {};
      obj.ret = aspect.proceed.apply(instance, args);
      const value = callback.call(instance, {
        instance, method: joinPoint.targetName, args, ...obj,
      });
      return value === void 0 ? obj.ret : value;
    },
  };
}
