import aspect from '../aspect.js';

const nothoing = () => {};

/**
 * 环绕通知（执行之前到返回之前），可拦截参数
 */
export default function around (fn = nothoing) {
  return {
    around (...args) {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      const obj = {};
      obj.ret = aspect.proceed.apply(instance, args);
      fn.call(instance, {
        instance, method: joinPoint.targetName, args, ...obj,
      });
      return obj.ret;
    },
  };
}
