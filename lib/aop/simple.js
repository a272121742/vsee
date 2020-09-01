/* eslint-disable */

const aspect = (function () {
  let nextId = 0;
  function advise (dispatcher, type, advice, receiveArguments) {
    let previous = dispatcher[type];
    const around = type == 'around';
    let signal;
    if (around) {
      const advised = advice(function () {
        return previous.advice(this, arguments);
      });
      signal = {
        remove () {
          signal.cancelled = true;
        },
        advice (target, args) {
          return signal.cancelled
            ? previous.advice(target, args) // cancelled, skip to next one
            : advised.apply(target, args);	// called the advised function
        },
      };
    } else {
      // create the remove handler
      signal = {
        remove () {
          const { previous } = signal;
          const { next } = signal;
          if (!next && !previous) {
            delete dispatcher[type];
          } else {
            if (previous) {
              previous.next = next;
            } else {
              dispatcher[type] = next;
            }
            if (next) {
              next.previous = previous;
            }
          }
        },
        id: nextId++,
        advice,
        receiveArguments,
      };
    }
    if (previous && !around) {
      if (type == 'after') {
        // add the listener to the end of the list
        let next = previous;
        while (next) {
          previous = next;
          next = next.next;
        }
        previous.next = signal;
        signal.previous = previous;
      } else if (type == 'before') {
        // add to beginning
        dispatcher[type] = signal;
        signal.next = previous;
        previous.previous = signal;
      }
    } else {
      // around or first one just replaces
      dispatcher[type] = signal;
    }
    return signal;
  }
  function aspect (type) {
    return function (target, methodName, advice, receiveArguments) {
      const existing = target[methodName];
      let dispatcher;
      if (!existing || existing.target != target) {
        // no dispatcher in place
        target[methodName] = dispatcher = function () {
          const executionId = nextId;
          // before advice
          let args = arguments;
          let { before } = dispatcher;
          while (before) {
            args = before.advice.apply(this, args) || args;
            before = before.next;
          }
          // around advice
          if (dispatcher.around) {
            var results = dispatcher.around.advice(this, args);
          }
          // after advice
          let { after } = dispatcher;
          while (after && after.id < executionId) {
            results = after.receiveArguments ? after.advice.apply(this, args) || results
              : after.advice.call(this, results);
            after = after.next;
          }
          return results;
        };
        if (existing) {
          dispatcher.around = {
            advice (target, args) {
              return existing.apply(target, args);
            },
          };
        }
        dispatcher.target = target;
      }
      const results = advise((dispatcher || existing), type, advice, receiveArguments);
      advice = null;
      return results;
    };
  }
  return {
    before: aspect('before'),
    around: aspect('around'),
    after: aspect('after'),
  };
}());

export default aspect;
