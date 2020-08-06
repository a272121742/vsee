/**
 *  表单混入器
 */
import Vue from 'vue';
import $ from '@http';
import {
  curry, pick, clone, map as mapObject,
} from 'ramda';
import {
  isInteger, isArray, isEqual, divide,
} from 'lodash';
import { clearObserver } from '@util/datahelper.js';
import {
  GET_MOMENT, DAY_RANGE, START_FIELDNAME, END_FIELDNAME, GET_DATETIME_FORMAT, GET_DATE_FORMAT, GET_TIME_FORMAT,
} from '@util/datetime-helper.js';
import { UPLOADER, FORM } from '@lib/config.js';

const {
  SERVER_FILE,
  CLIENT_FILE,
} = UPLOADER;
const {
  TRIGGER: trigger,
  VALIDATION,
} = FORM;

const hasOwnProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property);
const includeEmpty = (value) => [void 0, null].includes(value);

function id (value) {
  return value;
}

function format (str, replace = {}) {
  const keys = Object.keys(replace);
  let replaced = str;
  if (str) {
    keys.forEach((key) => {
      replaced = replaced.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), replace[key]);
    });
  }
  return replaced;
}

const custValidation = mapObject((pattern) => {
  if (pattern instanceof RegExp) {
    return (message) => ({ pattern, message });
  }
  throw new Error('【配置错误】：自定义验证必须为正则表达式');
}, VALIDATION);

/**
 * 判断数字是否符合验证要求：
 * 1. 如果不是数字`Number`，返回`true`;
 * 2. 如果数字小于`0`，返回`true`;
 * @param {Number} num - 需要验证的数据
 */
const notAllowNumber = (num) => !isInteger(num) || (num <= 0);

const FormRecord = ((function createFormWithCache () {
  const formRecordCache = new Map();
  function Record (record, map) {
    map.call(record, record);
    Object.assign(this, record);
    Vue.observable(this);
    const cached = clearObserver({ ...this });
    Object.defineProperties(cached, {
      map: {
        configurable: false,
        writable: false,
        enumerable: false,
        value: map,
      },
    });
    formRecordCache.set(this, cached);
  }
  /**
   * 设置表单值
   * @param {*} values - 值
   * @param {*} cacheIt - 是否缓存
   */
  Record.prototype.set = function set (values = {}, cacheIt = false) {
    const clonedValues = clone(values);
    const { map } = formRecordCache.get(this);
    map.call(clonedValues, clonedValues);
    const keys = Object.keys(clonedValues);
    keys.forEach((key) => {
      const value = clonedValues[key];
      if (hasOwnProperty(this, key)) {
        this[key] = value;
      } else {
        Vue.set(this, key, value);
      }
    });
    cacheIt && this.cache();
    return this;
  };

  /**
   * 装载表单值，`set(values, true)`的别名
   * @param {*} values - 值
   * @param {*} cacheIt - 是否缓存
   */
  Record.prototype.load = function load (values = {}, cacheIt = false) {
    const clonedValues = clone(values);
    const { map } = formRecordCache.get(this);
    map.call(clonedValues, clonedValues);
    const keys = Object.keys({ ...this, ...clonedValues });
    keys.forEach((key) => {
      const hasInValues = hasOwnProperty(clonedValues, key);
      const hasInRecord = hasOwnProperty(this, key);
      const value = hasInValues ? clonedValues[key] : null;
      if (!hasInValues) {
        this[key] = null;
        delete this[key];
      } else if (hasInRecord) {
        this[key] = value;
      } else {
        Vue.set(this, key, value);
      }
    });
    cacheIt && this.cache();
    return this;
  };

  /**
   * 缓存表单值
   * @param {*} fields - 允许缓存的字段
   */
  Record.prototype.cache = function cache (fields = []) {
    const record = clearObserver(this);
    const { map } = formRecordCache.get(this);
    const backup = (fields && fields.length) ? pick(fields, record) : record;
    Object.defineProperties(backup, {
      map: {
        configurable: false,
        writable: false,
        enumerable: false,
        value: map,
      },
    });
    formRecordCache.set(this, backup);
    return this;
  };

  /**
   * 清空表单值
   * @param {*} fields - 允许清空的值
   */
  Record.prototype.clear = function clear (fields = []) {
    const keys = (fields && fields.length) ? fields : Object.keys(this);
    keys.forEach((key) => {
      // if (hasOwnProperty(this, key)) {
      //   this[key] = null;
      // } else {
      //   Vue.set(this, key, null);
      // }
      if (!includeEmpty(this[key])) {
        Vue.set(this, key, null);
      }
    });
    return this;
  };

  /**
   * 重置表单值
   * @param {*} fields - 允许重置的值
   */
  Record.prototype.reset = function reset (fields) {
    const backup = formRecordCache.get(this);
    // eslint-disable-next-line no-unused-expressions
    if (fields && fields.length) {
      this.set(pick(fields, { ...backup }));
    } else {
      this.load({ ...backup });
    }
    return this;
  };

  Record.prototype.valueOf = function valueOf (mapping = id) {
    const result = clearObserver(this);
    mapping.call(result, result);
    return result;
  };

  return Record;
}).call(void 0));

export default ({ record = 'record', form = 'form', map = id } = {}) => ({
  data () {
    return {
      [record]: {},
    };
  },
  created () {
    this.$set(this, record, new FormRecord({ ...this[record] }, map));
    this[record].cache();
  },
  computed: {
    [form] () {
      return this.$refs[form];
    },
  },
});

// 转换为单个Moment值
export const map2Moment = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    record[field] = GET_MOMENT(record[field]);
  }
});
// 转换成Moment范围
export const map2MomentRange = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    const value = record[field];
    const result = value instanceof Array ? DAY_RANGE(...value) : DAY_RANGE(value);
    record[field] = result.map(GET_MOMENT);
  }
});

// 拆成两个Moment字段
export const split2MomentRange = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    const start = START_FIELDNAME(field);
    const end = END_FIELDNAME(field);
    const value = record[field];
    const [startValue, endValue] = value instanceof Array ? DAY_RANGE(...value) : DAY_RANGE(value);
    record[start] = GET_MOMENT(startValue);
    record[end] = GET_MOMENT(endValue);
  }
});
// 合并成一个Moment范围
export const zip2MomentRange = curry((field, record) => {
  if (record) {
    const start = START_FIELDNAME(field);
    const end = END_FIELDNAME(field);
    record[field] = [record[start], record[end]].map(GET_MOMENT);
  }
});
// 转换为日期时间字符串
export const map2Datetime = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    record[field] = GET_DATETIME_FORMAT(record[field]);
  }
});
// 转换为日期字符串
export const map2Date = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    record[field] = GET_DATE_FORMAT(record[field]);
  }
});
// 转换为时间字符串
export const map2Time = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    record[field] = GET_TIME_FORMAT(record[field]);
  }
});
// 转换成日期时间字符串组
export const map2DatetimeRange = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    const value = record[field];
    record[field] = value instanceof Array ? DAY_RANGE(...value) : DAY_RANGE(value);
  }
});
// 拆开成2个时间字符串字段
export const split2DatetimeRange = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    const start = START_FIELDNAME(field);
    const end = END_FIELDNAME(field);
    const value = record[field];
    const [startValue, endValue] = value instanceof Array ? DAY_RANGE(...value) : DAY_RANGE(value);
    record[start] = startValue;
    record[end] = endValue;
  }
});
// 合并成一个时间字符串组
export const zip2DatetimeRange = curry((field, record) => {
  if (record) {
    const start = START_FIELDNAME(field);
    const end = END_FIELDNAME(field);
    record[field] = [record[start], record[end]];
  }
});
// 转换成boolean类型
export const map2Boolean = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    record[field] = Boolean(record[field]);
  }
});

export const map2ServerFile = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    let value = record[field];
    if (value) {
      if (!(value instanceof Array)) {
        value = [value];
      }
      record[field] = value.map(SERVER_FILE).filter((file) => file);
    }
  }
});

export const map2ClientFile = curry((field, record) => {
  if (record && hasOwnProperty(record, field)) {
    let value = record[field];
    if (value) {
      if (!(value instanceof Array)) {
        value = [value];
      }
      record[field] = value.map(CLIENT_FILE);
    }
  }
});

// 删除一个字段
export const deleteField = curry((fields, record) => {
  if (fields && fields instanceof Array) {
    fields.forEach((field) => {
      delete record[field];
    });
  } else {
    delete record[fields];
  }
});

Vue.prototype.$v = {
  // 业务验证
  /**
   * 更多参考 https://github.com/mc-zone/IDValidator
   * 这里只做简易处理
   */
  idcard (message) {
    return { trigger, pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message };
  },
  // 手机
  phone (message) {
    return { trigger, pattern: /^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/, message };
  },
  mobile (message) {
    return { trigger, pattern: /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/, message };
  },
  username (message) {
    return { trigger, pattern: /^[a-zA-Z0-9~!@#$%^&*]{8,16}$/, message };
  },
  password (message) {
    return { trigger, pattern: /^[a-zA-Z0-9~!@#$%^&*]{6,20}$/, message };
  },
  // 用自定义业务验证覆盖原来的验证
  ...custValidation,
  required (message) {
    return { trigger, required: true, message };
  },
  /* 数字验证 */
  // value <= max
  max (max, message) {
    if (notAllowNumber(max)) {
      throw new Error('【配置错误】：max必须为数字');
    }
    return {
      trigger, type: 'number', transform: Number, max, message: format(message, { max }),
    };
  },
  // value <= max
  lte (max, message) {
    if (notAllowNumber(max)) {
      throw new Error('【配置错误】：max必须为数字');
    }
    return {
      trigger, type: 'number', transform: Number, max, message: format(message, { max }),
    };
  },
  // value < max
  lt (max, message) {
    if (notAllowNumber(max)) {
      throw new Error('【配置错误】：max必须为数字');
    }
    return {
      trigger, type: 'number', transform: Number, validator: (rule, val) => val < max, message: format(message, { max }),
    };
  },
  // value >= min
  min (min, message) {
    if (notAllowNumber(min)) {
      throw new Error('【配置错误】：min必须为数字');
    }
    return {
      trigger, type: 'number', transform: Number, min, message: format(message, { min }),
    };
  },
  gte (min, message) {
    if (notAllowNumber(min)) {
      throw new Error('【配置错误】：min必须为数字');
    }
    return {
      trigger, type: 'number', transform: Number, min, message: format(message, { min }),
    };
  },
  // value > min
  gt (min, message) {
    if (notAllowNumber(min)) {
      throw new Error('【配置错误】：max必须为数字');
    }
    return {
      trigger, type: 'number', transform: Number, validator: (rule, val) => val > min, message: format(message, { min }),
    };
  },
  // value ===
  eq (value, message) {
    return {
      trigger, validator: (rule, val) => val === value, message: format(message, { value }),
    };
  },
  equal (value, message) {
    return {
      trigger, validator: (rule, val) => isEqual(value, val), message: format(message, { value }),
    };
  },
  // value !==
  ne (value, message) {
    return {
      trigger, validator: (rule, val) => val !== value, message: format(message, { value }),
    };
  },
  range (range, message) {
    if (!isArray(range) || range.length !== 2) {
      throw new Error('【配置错误】：range必须为[min, max]类型数组');
    }
    const [min, max] = range;
    return {
      trigger, type: 'number', transform: Number, min, max, message: format(message, { min, max }),
    };
  },
  outof (range, message) {
    if (!isArray(range) || range.length !== 2) {
      throw new Error('【配置错误】：range必须为[min, max]类型数组');
    }
    const [min, max] = range;
    return {
      trigger, type: 'number', transform: Number, validator: (rule, val) => val < min || val > max, message: format(message, { min, max }),
    };
  },
  // min < value < max
  gtlt (range, message) {
    if (!isArray(range) || range.length !== 2) {
      throw new Error('【配置错误】：range必须为[min, max]类型数组');
    }
    const [min, max] = range;
    return {
      trigger, type: 'number', transform: Number, validator: (rule, val) => val > min && val < max, message: format(message, { min, max }),
    };
  },
  // min <= value < max
  lgte (range, message) {
    if (!isArray(range) || range.length !== 2) {
      throw new Error('【配置错误】：range必须为[min, max]类型数组');
    }
    const [min, max] = range;
    return {
      trigger, type: 'number', transform: Number, validator: (rule, val) => val >= min && val < max, message: format(message, { min, max }),
    };
  },
  // min < value <= max
  glte (range, message) {
    if (!isArray(range) || range.length !== 2) {
      throw new Error('【配置错误】：range必须为[min, max]类型数组');
    }
    const [min, max] = range;
    return {
      trigger, type: 'number', transform: Number, validator: (rule, val) => val > min && val <= max, message: format(message, { min, max }),
    };
  },
  // 整除的
  divisible (value, message) {
    return {
      trigger, type: 'integer', transform: (val) => divide(Number(val), Number(value)), message: format(message, { value }),
    };
  },
  /* 字符串验证 */
  maxLen (max, message) {
    if (notAllowNumber(max)) {
      throw new Error('【配置错误】：max必须为数字');
    }
    return {
      trigger, transform: String, max, message: format(message, { max }),
    };
  },
  minLen (min, message) {
    if (notAllowNumber(min)) {
      throw new Error('【配置错误】：min必须为数字');
    }
    return {
      trigger, transform: String, min, message: format(message, { min }),
    };
  },
  rangeLen (range, message) {
    if (!isArray(range) || range.length !== 2) {
      throw new Error('【配置错误】：range必须为[min, max]类型数组');
    }
    const [min, max] = range;
    return {
      trigger, transform: String, min, max, message: format(message, { min, max }),
    };
  },
  len (len, message) {
    if (notAllowNumber(len)) {
      throw new Error('【配置错误】：len必须为数字');
    }
    return {
      trigger, transform: String, len, message: format(message, { len }),
    };
  },
  // equal (value = '', message) {
  //   return { pattern: new RegExp(`^${value}$`, 'g'), message: format(message, { value }) };
  // },
  enum (list, message) {
    if (!isArray(list) || !list.length) {
      throw new Error('【配置错误】：arr必须为不为空的数组');
    }
    return {
      trigger, type: 'enum', enum: list, message: format(message, { list: list.join('/') }),
    };
  },
  // 前缀判断(startWith)
  prefix (txt = '', message) {
    return {
      trigger, type: 'string', transform: String, pattern: new RegExp(`^${txt}`, 'g'), message: format(message, { txt }),
    };
  },
  // 后缀判断(endWith)
  suffix (txt = '', message) {
    return {
      trigger, type: 'string', transform: String, pattern: new RegExp(`${txt}$`, 'g'), message: format(message, { txt }),
    };
  },
  // 包含
  include (txt, message) {
    return {
      trigger, type: 'string', transform: String, pattern: new RegExp(`${txt}`, 'g'), message: format(message, { txt }),
    };
  },
  // 排除
  exclude (txt, message) {
    return {
      trigger, type: 'string', transform: String, pattern: new RegExp(`^((?!${txt}).)*$`, 'g'), message: format(message, { txt }),
    };
  },
  unique (message) {
    return {
      trigger,
      validator: (rule, arr) => {
        if (arr instanceof Array || typeof arr === 'string') {
          const newArray = new Set(arr);
          return [...newArray].length === arr.length;
        }
        return true;
      },
      message,
    };
  },
  // 包含
  within (list, message) {
    if (!isArray(list) || !list.length) {
      throw new Error('【配置错误】：arr必须为不为空的数组');
    }
    const txt = list.map((item) => `(${item})`).join('|');
    return {
      trigger, type: 'string', pattern: new RegExp(`${txt}`, 'g'), message: format(message, { list: list.join('/') }),
    };
  },
  // 排除
  without (list, message) {
    if (!isArray(list) || !list.length) {
      throw new Error('【配置错误】：arr必须为不为空的数组');
    }
    const txt = list.join('|');
    return {
      trigger, type: 'string', pattern: new RegExp(`^((?!(${txt})).)*$`, 'g'), message: format(message, { list: list.join('/') }),
    };
  },
  // 包含中文
  includeZh (message) {
    return {
      trigger, transform: String, pattern: /[\u4e00-\u9fa5]+/g, message,
    };
  },
  // 只能包含中文
  onlyZh (message) {
    return {
      trigger, transform: String, pattern: /^[\u4e00-\u9fa5]+$/, message,
    };
  },
  // 不能包含中文
  excludeZh (message) {
    return {
      trigger, transform: String, pattern: /^[^\u4e00-\u9fa5]+$/, message,
    };
  },
  // 只能是双字节
  maybeDByte (message) {
    return { trigger, pattern: /[^\x00-\xff]+$/, message };
  },
  pattern (pattern, message) {
    return {
      trigger, pattern, transform: String, message: format(message, { pattern }),
    };
  },
  // int
  int (message) {
    return {
      trigger, type: 'integer', transform: Number, message,
    };
  },
  float (message) {
    return {
      trigger, type: 'float', transform: Number, message,
    };
  },
  /* 类型验证 */
  email (message) {
    return { trigger, type: 'email', message };
  },
  url (message) {
    return { trigger, type: 'url', message };
  },
  // 十六进制
  hex (message) {
    return { trigger, type: 'hex', message };
  },
  ip (message) {
    return {
      trigger, type: 'string', pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message,
    };
  },
  color (message) {
    return {
      trigger, type: 'string', pattern: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, message,
    };
  },
  // 自定义验证
  custom (fn, message) {
    if (!(fn instanceof Function)) {
      throw new Error('【配置错误】：fn必须为函数');
    }
    return { trigger, validator: fn, message };
  },
  // 远程验证
  remote ({
    url, query = {}, success, trigger: remoteTrigger = 'blur',
  } = {}) {
    if (!url) {
      throw new Error('【配置错误】：url必须不能为空');
    }
    if (success && !(success instanceof Function)) {
      throw new Error('【配置错误】：url必须不能为空');
    }
    return {
      trigger: remoteTrigger,
      asyncValidator (rule, value, callback) {
        const params = JSON.parse(format(JSON.stringify(query), { value }));
        const api = format(url, { value });
        if (value) {
          $.get(api, params).then((res) => {
            callback(success(res));
          }).catch((err) => {
            callback(err);
          });
        }
      },
    };
  },
};
