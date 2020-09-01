import aspect from '../aspect.js';

const nothoing = () => {};

/**
 * 后置通知（返回之后），不拦截任何
 */
export default function after (fn = nothoing) {
  return {
    after () {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      fn.call(instance, {
        instance, method: joinPoint.targetName,
      });
    },
  };
}
