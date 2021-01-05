import { sha1, base64encode, base64decode } from '@util/crypto-helper.js';
import { identity } from 'ramda';
import { isString, toString } from 'lodash';
import Cookies from 'js-cookie';
import aop from '@aop';
import { STORAGE } from '@lib/config.js';
import { hasOwnProperty } from '@util/logic-helper.js';

const { crypto = true } = STORAGE;

const keyCrypto = crypto ? sha1 : identity;
const valueEnc = crypto ? base64encode : identity;
const valueDec = crypto ? base64decode : identity;

aop.advise(localStorage, 'setItem', {
  around (key, value) {
    return aop.proceed.call(null, keyCrypto(key), valueEnc(value));
  },
});
aop.advise(localStorage, 'getItem', {
  around (key) {
    return valueDec(aop.proceed.call(null, keyCrypto(key)));
  },
});
aop.advise(localStorage, 'removeItem', {
  around (key) {
    return aop.proceed.call(null, keyCrypto(key));
  },
});

aop.advise(sessionStorage, 'setItem', {
  around (key, value) {
    return aop.proceed.call(null, keyCrypto(key), valueEnc(value));
  },
});
aop.advise(sessionStorage, 'getItem', {
  around (key) {
    return valueDec(aop.proceed.call(null, keyCrypto(key)));
  },
});
aop.advise(sessionStorage, 'removeItem', {
  around (key) {
    return aop.proceed.call(null, keyCrypto(key));
  },
});

aop.advise(Cookies, 'set', {
  around (key, value, config) {
    return aop.proceed.call(null, keyCrypto(key), valueEnc(value), config);
  },
});
aop.advise(Cookies, 'get', {
  around (key) {
    return valueDec(aop.proceed.call(null, keyCrypto(key)));
  },
});
aop.advise(Cookies, 'remove', {
  around (key) {
    return aop.proceed.call(null, keyCrypto(key));
  },
});

export default (() => {
  const memory = Object.create(null);
  class Storage {
    get (key) {
      if (isString(key)) {
        const sKey = keyCrypto(toString(key));
        const sValue = memory[sKey];
        return valueDec(sValue);
      }
      return this.memory;
    }

    set (key, value) {
      if (isString(key)) {
        const sKey = keyCrypto(toString(key));
        const sValue = valueEnc(value);
        memory[sKey] = sValue;
      }
    }

    remove (key) {
      if (isString(key)) {
        const sKey = keyCrypto(toString(key));
        return delete memory[sKey];
      }
      return delete memory[key];
    }

    has (key) {
      if (isString(key)) {
        const sKey = keyCrypto(toString(key));
        return hasOwnProperty(sKey, memory);
      }
      return false;
    }
  }
  Object.freeze(Storage.prototype);
  const stroage = new Storage();
  // eslint-disable-next-line no-proto
  Object.freeze(stroage.__proto__);
  return stroage;
})();
