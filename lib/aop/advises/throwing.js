import aspect from '../aspect.js';

const nothoing = () => {};

export default function after (fn = nothoing) {
  return {
    afterThrowing (exp) {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      fn.call(instance, {
        instance, method: joinPoint.targetName, exp,
      });
    },
  };
}
