/* eslint-disable */
import aspect from '../aspect.js';

// const nothing = () => {};

function reset (/* String|Array? */method) {
  const that = aspect.getContext().instance;
  let t;
  if (!(t = that.__memoizerCache)) {
    return;
  }
  if (arguments.length == 0) {
    delete that.__memoizerCache;
  } else if (isArray(method)) {
    method.forEach((m) => {
      delete t[m];
    });
  } else {
    delete t[method];
  }
};

/**
 * 自定义通知
 */
export default (method) => {
  return  {
    after () {
      reset(method);
    }
  };
};

