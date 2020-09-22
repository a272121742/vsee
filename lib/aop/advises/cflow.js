import aspect from '../aspect.js';

const nothoing = () => {};

// Object.defineProperties(aspect, {
//   cflow: {
//     writable: false,
//     configrable: false,
//     enumerable: false,
//     value (...args) {
//       const [instance] = args;
//       let [, method] = args;
//       if (args.length > 1 && !(method instanceof Array)) {
//         method = [method];
//       }
//       const contextStack = aspect.getContextStack();
//       for (let i = contextStack.length - 1; i >= 0; i -= 1) {
//         const c = contextStack[i];
//         if (instance && c.instance !== instance) {
//           // eslint-disable-next-line no-continue
//           continue;
//         }
//         if (!method) { return true; }
//         const n = c.joinPoint.targetName;
//         for (let j = method.length - 1; j >= 0; j -= 1) {
//           const m = method[j];
//           if (m instanceof RegExp) {
//             if (m.test(n)) { return true; }
//           } else if (n === m) { return true; }
//         }
//       }
//       return false;
//     },
//   },
// });

function isFlow (...args) {
  const [instance] = args;
  let [, method] = args;
  if (args.length > 1 && !(method instanceof Array)) {
    method = [method];
  }
  const contextStack = aspect.getContextStack();
  for (let i = contextStack.length - 1; i >= 0; i -= 1) {
    const c = contextStack[i];
    if (instance && c.instance !== instance) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!method) { return true; }
    const n = c.joinPoint.targetName;
    for (let j = method.length - 1; j >= 0; j -= 1) {
      const m = method[j];
      if (m instanceof RegExp) {
        if (m.test(n)) { return true; }
      } else if (n === m) { return true; }
    }
  }
  return false;
}
/**
 * 自定义通知
 */
export default (Fn = nothoing) => (context) => (isFlow(context.instance) ? {} : new Fn(context));

export {
  isFlow,
};
