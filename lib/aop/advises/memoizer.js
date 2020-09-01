/* eslint-disable */
import aspect from '../aspect.js';

const nothing = () => {};

const memoize1 = {
  around (key) {
    const context = aspect.getContext();
    const { instance, joinPoint } = context;
    let t;
    let u;
    if ((t = instance.__memoizerCache) && (t = t[joinPoint.targetName]) && (key in t)) {
      return t[key];
    }
    const ret = aspect.proceed.apply(null, arguments);
    if (!(t = instance.__memoizerCache)) {
      t = instance.__memoizerCache = {};
    }
    if (!(u = t[joinPoint.targetName])) {
      u = t[joinPoint.targetName] = {};
    }
    return u[key] = ret;
  },
};
function memoizeN (keyMaker) {
  return {
    around () {
      const context = aspect.getContext();
      const { instance, joinPoint } = context;
      let t; 
      let u; 
      const key = keyMaker.apply(that, arguments);
      if ((t = instance.__memoizerCache) && (t = t[joinPoint.targetName]) && (key in t)) {
        return t[key];
      }
      let ret = aspect.proceed.apply(null, arguments);
      if (!(t = instance.__memoizerCache)) {
        t = instance.__memoizerCache = {};
      }
      if (!(u = t[joinPoint.targetName])) {
        u = t[joinPoint.targetName] = {};
      }
      return u[key] = ret;
    },
  };
}

/**
 * 自定义通知
 */
export default (...args) =>  {
  const [key] = args;
  return args.length ? memoizeN(key) : memoize1;
};
