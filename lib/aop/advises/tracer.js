import aspect from '../aspect.js';

function Tracer (grouping = true) {
  this.method = grouping ? 'group' : 'log';
  if (grouping) {
    this.after = this._after;
  }
  Object.assign(this, {
    before (...args) {
      const context = aspect.getContext();
      const { joinPoint } = context;
      console[this.method](context.instance, 'before --> ', `${joinPoint.targetName}(${args})`);
    },
    afterReturning (retVal) {
      const { joinPoint } = aspect.getContext();
      if (typeof retVal !== 'undefined') {
        console.log(`${joinPoint.targetName}() returns:`, retVal);
      } else {
        console.log(`${joinPoint.targetName}() no return`);
      }
    },
    afterThrowing (excp) {
      console.log(`${aspect.getContext().joinPoint.targetName}() throws:`, excp);
    },
    _after () {
      console.groupEnd();
    },
  });
}

export default (bool) => new Tracer(bool);
