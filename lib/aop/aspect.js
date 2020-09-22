
const isFunction = (fn) => fn instanceof Function;
const isArray = ('isArray' in Array) ? Array.isArray : (value) => toString.call(value) === '[object Array]';

/* eslint-disable */
const aspect = (function getAspector () {
  const self = {};
  const ap = Array.prototype;
  const contextStack = [];
  let context;

  function Advice () {
    const me = this;
    me.next_before = this;
    me.prev_before = this;
    me.next_around = this;
    me.prev_around = this;
    me.next_afterReturning = this;
    me.prev_afterReturning = this;
    me.next_afterThrowing = this;
    me.prev_afterThrowing = this;
    me.counter = 0;
  }

  Object.assign(Advice.prototype, {
    add (advice) {
      const me = this;
      const dyn = isFunction(advice);
      const node = {
        advice,
        dynamic: dyn,
      };
      me._add(node, 'before', '', dyn, advice);
      me._add(node, 'around', '', dyn, advice);
      me._add(node, 'after', 'Returning', dyn, advice);
      me._add(node, 'after', 'Throwing', dyn, advice);
      me.counter += 1;
      return node;
    },
    _add (node, topic, subtopic, dyn, advice) {
      const full = topic + subtopic;
      if (dyn || advice[topic] || (subtopic && advice[full])) {
        const next = `next_${full}`;
        const prev = `prev_${full}`;
        (node[prev] = this[prev])[next] = node;
        (node[next] = this)[prev] = node;
      }
    },
    remove (node) {
      const me = this;
      me._remove(node, 'before');
      me._remove(node, 'around');
      me._remove(node, 'afterReturning');
      me._remove(node, 'afterThrowing');
      me.counter -= 1;
    },
    _remove (node, topic) {
      const next = `next_${topic}`;
      const prev = `prev_${topic}`;
      if (node[next]) {
        node[next][prev] = node[prev];
        node[prev][next] = node[next];
      }
    },
    isEmpty () {
      const me = this;
      return !me.counter;
    },
  });

  function getDispatcher () {
    return function Dispatcher (...args) {
      const { advices } = Dispatcher;
      let ret;
      let i;
      let a;
      let t;
      let exp;
      if (context) {
        contextStack.push(context);
      }
      context = {
        instance: this,
        joinPoint: Dispatcher,
        depth: contextStack.length,
        around: advices.prev_around,
        dynAdvices: [],
        dynIndex: 0,
      };
      try {
        for (i = advices.prev_before; i !== advices; i = i.prev_before) {
          if (i.dynamic) {
            context.dynAdvices.push((a = new i.advice(context)));
            if(t = a.before){
              t.apply(a, args);
            }
          } else {
            t = i.advice;
            t.before.apply(t, args);
          }
        }
        try {
          ret = (advices.prev_around === advices ? Dispatcher.target : aspect.proceed).apply(this, args);
        } catch (e) {
          exp = e;
          context.dynIndex = context.dynAdvices.length;
          for (i = advices.next_afterThrowing; i !== advices; i = i.next_afterThrowing) {
            a = i.dynamic ? context.dynAdvices[--context.dynIndex] : i.advice;
            if ((t = a.afterThrowing)) {
              t.call(a, e);
            }
            if ((t = a.after)) {
              t.call(a);
            }
          }
          throw e;
        }
        context.dynIndex = context.dynAdvices.length;
        for (i = advices.next_afterReturning; i !== advices; i = i.next_afterReturning) {
          a = i.dynamic ? context.dynAdvices[--context.dynIndex] : i.advice;
          if ((t = a.afterReturning)) {
            t.call(a, ret);
          }
          if ((t = a.after)) {
            t.call(a);
          }
        }
        const ls = Dispatcher._listeners;
        for (i in ls) {
          if (!(i in ap)) {
            ls[i].apply(this, args);
          }
        }
      } finally {
        for (i = 0; i < context.dynAdvices.length; i += 1) {
          a = context.dynAdvices[i];
          if (a.destroy) {
            a.destroy();
          }
        }
        context = contextStack.length ? contextStack.pop() : null;
      }
      return ret;
    };
  }

  Object.assign(self, {
    advise (obj, method, advice) {
      if (typeof obj !== 'object') {
        obj = obj.prototype;
      }
      const methods = [];
      if (!(method instanceof Array)) {
        method = [method];
      }
      for (let j = 0; j < method.length; j += 1) {
        const t = method[j];
        if (t instanceof RegExp) {
          const objs = { ...obj, ...Object.getOwnPropertyDescriptors(obj)}
          for(let i in objs){
            if(isFunction(obj[i]) && t.test(i)){
              methods.push(i);
            }
          }
        } else if (isFunction(obj[t])) {
          methods.push(t);
        }
      }
      if (!isArray(advice)) {
        advice = [advice];
      }
      return aspect.adviseRaw(obj, methods, advice);
    },
    adviseRaw (obj, methods, advices) {
      if (!methods.length || !advices.length) {
        return null;
      }
      const m = {};
      const al = advices.length;
      for (let i = methods.length - 1; i >= 0; i -= 1) {
        const name = methods[i];
        const o = obj[name];
        const ao = new Array(al);
        let t = o.advices;
        if (!t) {
          const x = getDispatcher();
          obj[name] = x;
          x.target = o.target || o;
          x.targetName = name;
          x._listeners = o._listeners || [];
          x.advices = new Advice();
          t = x.advices;
        }
        for (let j = 0; j < al; j += 1) {
          ao[j] = t.add(advices[j]);
        }
        m[name] = ao;
      }
      return [obj, m];
    },
    unadvise (handle) {
      if (!handle) {
        return;
      }
      const obj = handle[0];
      const methods = handle[1];
      for (let name in methods) {
        const o = obj[name];
        const t = o.advices;
        const ao = methods[name];
        for (let i = ao.length - 1; i >= 0; i -= 1) {
          t.remove(ao[i]);
        }
        if (t.isEmpty()) {
          let empty = true;
          const ls = o._listeners;
          if(ls.length){
            for(i in ls){
              if(!(i in ap)){
                empty = false;
                break;
              }
            }
          }
          if (empty) {
            obj[name] = o.target;
          } else {
            console.log('这里有问题');
            // 这里有问题
            const d = {};
            obj[name] = d._listener.getDispatcher();
            const x = obj[name];
            x.target = o.target;
            x._listeners = ls;
          }
        }
      }
    },
    getContext () {
      return context;
    },
    getContextStack () {
      return contextStack;
    },
    proceed (...args) {
      const { joinPoint } = context;
      const { advices } = joinPoint;
      for (let c = context.around; c !== advices; c = context.around) {
        context.around = c.prev_around;
        if (c.dynamic) {
          // eslint-disable-next-line no-plusplus
          const a = context.dynAdvices[context.dynIndex++];
          const t = a.around;
          if (t) {
            return t.apply(a, args);
          }
        } else {
          return c.advice.around.apply(c.advice, args);
        }
      }
      return joinPoint.target.apply(context.instance, args);
    },
  });
  return Object.freeze(self);
}());

export default aspect;
