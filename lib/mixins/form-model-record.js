/**
 *  表单混入器
 */
import { validator } from '@util/formhelper.js';
import { clearObserver } from '@util/datahelper.js';
import {
  GET_MOMENT, DAY_RANGE, START_FIELDNAME, END_FIELDNAME, GET_DATETIME_FORMAT, GET_DATE_FORMAT, GET_TIME_FORMAT,
} from '@util/datetime-helper.js';
import { curry, pick, clone } from 'ramda';
import Vue from 'vue';
import config from '~/config.js';

const {
  UPLOADER = {},
} = config;

const {
  SERVER_FILE = (cf) => ({
    id: cf.uid,
    name: cf.name,
    path: cf.url,
    size: cf.size,
  }),
  CLIENT_FILE = (sf = {}) => ({
    uid: sf.uid || sf.id,
    name: sf.name,
    url: sf.path,
    status: (sf.uid || sf.id) ? 'done' : 'error',
    size: sf.size,
    response: sf.response || sf.path || sf.name,
  }),
} = UPLOADER;

const hasOwnProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property);
const includeEmpty = (value) => [void 0, null].includes(value);

function id (value) {
  return value;
}

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
  mixins: [validator],
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
