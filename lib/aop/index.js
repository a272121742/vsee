import aop from './aspect.js';

import before from './advises/before.js';
import around from './advises/around.js';
import after from './advises/after.js';
import returning from './advises/returning.js';
import throwing from './advises/throwing.js';
import cflow from './advises/cflow.js';
import tracer from './advises/tracer';
import monitor from './advises/monitor.js';
import memoizer from './advises/memoizer.js';
import memoizerGuard from './advises/memoizerGuard.js';

export default aop;

export {
  before,
  around,
  after,
  returning,
  throwing,
  cflow,
  tracer,
  monitor,
  memoizer,
  memoizerGuard,
};
