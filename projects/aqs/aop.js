/* eslint-disable */
import aop, { before, cflow, monitor } from '@aop';

console.dir(aop);
console.dir(before);

// const util = {
//   double (value) {
//     if (typeof value !== 'number') {
//       throw new Error('传入参数不是数字');
//       return 0;
//     } 
//     return 2 * value;
//   }
// }

// aop.advise(Math, /\S/, [
//   before((opt) => {
//     console.log(opt);
//     console.log(`Math.${opt.method}运行了，参数列表为`, ...opt.args);
//   }),
// ]);

// aop.advise(Math, /\S/, [{
//   before (...args) {
//     const context = aop.getContext();
//     const joinPoint = context.joinPoint;
//     console.log(joinPoint.targetName);
//   }
// }]);
const util = {
  sum (value, ...args) {
    if (!args.length) {
      return value;
    }
    const [first, ...others] = args;
    return util.sum(value + first, ...others);
  },
};

aop.advise(Math, /\S/, monitor(cflow((opt) => {
  console.log('监控函数运行结果', opt);
})));

// aop.advise(util, 'sum', before((res) => {
//   console.log('before', ...res.args);
// }, true));

console.log('最终结果',util.sum(1, 2, 3, 4));

