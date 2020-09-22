import aspect from '../aspect.js';
import cflow from './cflow.js';

const nothoing = () => {};

/**
 * 后置通知（返回之后），不拦截任何
 */
export default function after (fn = nothoing, flow) {
  const callback = flow ? cflow(fn) : fn;
  return {
    after () {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      callback.call(instance, {
        instance, method: joinPoint.targetName,
      });
    },
  };
}
