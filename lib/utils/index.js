import { v4 as uuidv4 } from 'uuid';

function getUUID () {
  return uuidv4();
}

const unlive = (() => {
  function timerCost (fn, t = 1, args = []) {
    let me = Object.create(null);
    const maxTime = t;
    let time = maxTime;
    const eventHandler = () => {
      time = maxTime;
    };
    ['mousemove', 'mousedown', 'keydown', 'contextmenu'].forEach((eventType) => {
      document.addEventListener(eventType, eventHandler);
    });
    const intervalId = setInterval(() => {
      time -= 1;
      if (time <= 0) {
        fn.call(null, ...args);
        clearInterval(intervalId);
        delete me.clear;
        me = null;
      }
    }, 1000);
    Object.defineProperty(me, 'clear', {
      writable: false,
      enumerable: false,
      configurable: true,
      value () {
        clearInterval(intervalId);
        delete me.clear;
        me = null;
      },
    });
    return me;
  }
  return timerCost;
})();

export {
  getUUID,
  unlive,
};
