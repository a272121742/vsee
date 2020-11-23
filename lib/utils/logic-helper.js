import { curry, prop, length } from 'ramda';
import { isNil, isUndefined } from 'lodash';

const hasOwnProperty = curry((property, obj) => !isNil(obj) && [].hasOwnProperty.call(obj, property));
const hasProperty = curry((property, obj) => !isNil(obj) && (!isUndefined(obj[property]) || [prop('__proto__', obj), prop('prototype', obj)].some((proto) => hasOwnProperty(property, proto))));
const isSafeArray = (arr) => (arr instanceof Array && !!length(arr));
const hasSafeChildren = curry((childrenName, obj) => (hasOwnProperty(childrenName, obj) && isSafeArray(obj[childrenName])));

export {
  hasOwnProperty,
  hasProperty,
  isSafeArray,
  hasSafeChildren,
};
