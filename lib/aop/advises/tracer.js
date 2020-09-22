import aspect from '../aspect.js';
import { isFlow } from './cflow.js';

function Tracer (grouping = true) {
  this.method = grouping ? 'group' : 'log';
  Object.assign(this, {
    before (...args) {
      const context = aspect.getContext();
      const { joinPoint } = context;
      console[this.method](context.instance, ` before --> ${joinPoint.targetName}(${args})`);
    },
    afterReturning (retVal) {
      const { joinPoint } = aspect.getContext();
      if (typeof retVal !== 'undefined') {
        console.log(`${joinPoint.targetName} afterReturning --> returns:`, retVal);
      } else {
        console.log(`${joinPoint.targetName} afterReturning --> no return`);
      }
    },
    afterThrowing (excp) {
      console.log(`${aspect.getContext().joinPoint.targetName} afterReturning --> throws:`, excp);
    },
    _after () {
      console.groupEnd();
    },
  });
  if (grouping) {
    this.after = this._after;
  }
}

export default (bool, flow) => {
  const tracer = new Tracer(bool);
  const advise = (context) => (isFlow(context.instance) ? {} : tracer);
  return flow ? advise : tracer;
};
