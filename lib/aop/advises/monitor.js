import aspect from '../aspect.js';

const nothing = () => {};

const allowFunction = (fn) => fn && fn instanceof Function && fn !== nothing;

const Monitor = (() => {
  let cb = null;
  let calls = 0;
  let errors = 0;
  let times = 0;

  function MonitorConstructor (fn) {
    this.reset();
    cb = fn;
    if (allowFunction(cb)) {
      Object.assign(this, {
        after () {
          const context = aspect.getContext();
          const { instance, joinPoint } = context;
          fn.call(null, {
            // eslint-disable-next-line no-plusplus
            instance, method: joinPoint.targetName, calls: ++calls, errors, times: window.performance.now() - times,
          });
        },
      });
    }
  }
  Object.assign(MonitorConstructor.prototype, {
    reset () {
      this.name = '';
      times = 0;
      calls = 0;
      errors = 0;
    },
    afterThrowing () {
      errors += 1;
    },
  });
  return MonitorConstructor;
})();


/**
 * 自定义通知
 */
export default (fn = nothing) => new Monitor(fn);
