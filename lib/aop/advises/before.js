import aspect from '../aspect.js';
import cflow from './cflow.js';

const nothoing = () => {};

/**
 * 前置通知（执行之前），可拦截参数
 */
export default function before (fn = nothoing, flow) {
  const callback = flow ? cflow(fn) : fn;
  return {
    before (...args) {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      callback.call(instance, { instance, method: joinPoint.targetName, args });
    },
  };
}
