import aspect from '../aspect.js';

const nothoing = () => {};

/**
 * 返回通知，拦截返回值
 */
export default function after (fn = nothoing) {
  return {
    afterReturning (ret) {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      fn.call(instance, {
        instance, method: joinPoint.targetName, ret,
      });
    },
  };
}
