import aspect from '../aspect.js';
import cflow from './cflow.js';

const nothoing = () => {};

/**
 * 返回通知，拦截返回值
 */
export default function after (fn = nothoing, flow) {
  const callback = flow ? cflow(fn) : fn;
  return {
    afterReturning (ret) {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      callback.call(instance, {
        instance, method: joinPoint.targetName, ret,
      });
    },
  };
}
