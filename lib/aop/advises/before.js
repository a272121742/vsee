import aspect from '../aspect.js';

const nothoing = () => {};

/**
 * 前置通知（执行之前），可拦截参数
 */
export default function before (fn = nothoing) {
  return {
    before (...args) {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      fn.call(instance, { instance, method: joinPoint.targetName, args });
    },
  };
}
