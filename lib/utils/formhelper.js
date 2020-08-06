import {
  isInteger, isArray, isEqual, divide,
} from 'lodash';
import { map } from 'ramda';
import $ from '@http';
import { FORM } from '@lib/config.js';

const { VALIDATION } = FORM;
const custValidation = map((pattern) => {
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
const hasOwnProperty = (obj, property = '') => Object.prototype.hasOwnProperty.call(obj, property);
/**
 *
 * @param {*} vm
 * @param {*} fields
 * @param {*} path
 */
export const createFormFields = (vm, fields = [], path) => {
  console.error('准备弃用，请使用form-record-mix方案');
  const obj = vm[path] ? vm[path] : vm;
  const keys = fields.length ? fields : Object.keys(obj);
  const result = {};
  keys.forEach((key) => {
    result[key] = vm.$form.createFormField({ value: obj[key] });
  });
  return result;
};

export const autoUpdateFileds = (vm, path) => {
  console.error('准备弃用，请使用form-record-mix方案');
  return function onFiledsChange (props, values) {
    const record = hasOwnProperty(vm, path) ? vm[path] : vm;
    // const key = Object.keys(values)[0];
    // record[key] = values[key] === void 0 ? null : values[key];
    const entrys = Object.entries(values);
    entrys.forEach((entry) => {
      const key = entry[0];
      const value = entry[1];
      if (value instanceof Array && (value.includes(void 0) || value.length === 1)) {
        const last = value.length - 1;
        record[key][last] = value[last];
      } else {
        record[key] = value === void 0 ? null : value;
      }
    });
  };
};

export const mapPropsToFields = (vm, fields = [], path) => () => {
  const obj = vm[path] ? vm[path] : vm;
  if (!obj._isVue) {
    const keys = fields.length ? fields : Object.keys(obj);
    const result = {};
    keys.forEach((key) => {
      result[key] = vm.$form.createFormField({ value: obj[key] });
    });
    return result;
  }
  return {};
};

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

export const validator = {
  beforeCreate () {
    this.$v = {
      // 业务验证
      /**
       * 更多参考 https://github.com/mc-zone/IDValidator
       * 这里只做简易处理
       */
      idcard (message) {
        return { pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message };
      },
      // 手机
      phone (message) {
        return { pattern: /^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/, message };
      },
      mobile (message) {
        return { pattern: /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/, message };
      },
      username (message) {
        return { pattern: /^[a-zA-Z0-9~!@#$%^&*]{8,16}$/, message };
      },
      password (message) {
        return { pattern: /^[a-zA-Z0-9~!@#$%^&*]{6,20}$/, message };
      },
      // 用自定义业务验证覆盖原来的验证
      ...custValidation,
      required (message) {
        return { required: true, message };
      },
      /* 数字验证 */
      // value <= max
      max (max, message) {
        if (notAllowNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          type: 'number', transform: Number, max, message: format(message, { max }),
        };
      },
      // value <= max
      lte (max, message) {
        if (notAllowNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          type: 'number', transform: Number, max, message: format(message, { max }),
        };
      },
      // value < max
      lt (max, message) {
        if (notAllowNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          type: 'number', transform: Number, validator: (rule, val) => val < max, message: format(message, { max }),
        };
      },
      // value >= min
      min (min, message) {
        if (notAllowNumber(min)) {
          throw new Error('【配置错误】：min必须为数字');
        }
        return {
          type: 'number', transform: Number, min, message: format(message, { min }),
        };
      },
      gte (min, message) {
        if (notAllowNumber(min)) {
          throw new Error('【配置错误】：min必须为数字');
        }
        return {
          type: 'number', transform: Number, min, message: format(message, { min }),
        };
      },
      // value > min
      gt (min, message) {
        if (notAllowNumber(min)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          type: 'number', transform: Number, validator: (rule, val) => val > min, message: format(message, { min }),
        };
      },
      // value ===
      eq (value, message) {
        return {
          validator: (rule, val) => val === value, message: format(message, { value }),
        };
      },
      equal (value, message) {
        return {
          validator: (rule, val) => isEqual(value, val), message: format(message, { value }),
        };
      },
      // value !==
      ne (value, message) {
        return {
          validator: (rule, val) => val !== value, message: format(message, { value }),
        };
      },
      range (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          type: 'number', transform: Number, min, max, message: format(message, { min, max }),
        };
      },
      outof (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          type: 'number', transform: Number, validator: (rule, val) => val < min || val > max, message: format(message, { min, max }),
        };
      },
      // min < value < max
      gtlt (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          type: 'number', transform: Number, validator: (rule, val) => val > min && val < max, message: format(message, { min, max }),
        };
      },
      // min <= value < max
      lgte (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          type: 'number', transform: Number, validator: (rule, val) => val >= min && val < max, message: format(message, { min, max }),
        };
      },
      // min < value <= max
      glte (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          type: 'number', transform: Number, validator: (rule, val) => val > min && val <= max, message: format(message, { min, max }),
        };
      },
      // 整除的
      divisible (value, message) {
        return { type: 'integer', transform: (val) => divide(Number(val), Number(value)), message: format(message, { value }) };
      },
      /* 字符串验证 */
      maxLen (max, message) {
        if (notAllowNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return { transform: String, max, message: format(message, { max }) };
      },
      minLen (min, message) {
        if (notAllowNumber(min)) {
          throw new Error('【配置错误】：min必须为数字');
        }
        return { transform: String, min, message: format(message, { min }) };
      },
      rangeLen (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          transform: String, min, max, message: format(message, { min, max }),
        };
      },
      len (len, message) {
        if (notAllowNumber(len)) {
          throw new Error('【配置错误】：len必须为数字');
        }
        return {
          transform: String, len, message: format(message, { len }),
        };
      },
      // equal (value = '', message) {
      //   return { pattern: new RegExp(`^${value}$`, 'g'), message: format(message, { value }) };
      // },
      enum (list, message) {
        if (!isArray(list) || !list.length) {
          throw new Error('【配置错误】：arr必须为不为空的数组');
        }
        return { type: 'enum', enum: list, message: format(message, { list: list.join('/') }) };
      },
      // 前缀判断(startWith)
      prefix (txt = '', message) {
        return {
          type: 'string', transform: String, pattern: new RegExp(`^${txt}`, 'g'), message: format(message, { txt }),
        };
      },
      // 后缀判断(endWith)
      suffix (txt = '', message) {
        return {
          type: 'string', transform: String, pattern: new RegExp(`${txt}$`, 'g'), message: format(message, { txt }),
        };
      },
      // 包含
      include (txt, message) {
        return {
          type: 'string', transform: String, pattern: new RegExp(`${txt}`, 'g'), message: format(message, { txt }),
        };
      },
      // 排除
      exclude (txt, message) {
        return {
          type: 'string', transform: String, pattern: new RegExp(`^((?!${txt}).)*$`, 'g'), message: format(message, { txt }),
        };
      },
      unique (message) {
        return {
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
        return { type: 'string', pattern: new RegExp(`${txt}`, 'g'), message: format(message, { list: list.join('/') }) };
      },
      // 排除
      without (list, message) {
        if (!isArray(list) || !list.length) {
          throw new Error('【配置错误】：arr必须为不为空的数组');
        }
        const txt = list.join('|');
        return { type: 'string', pattern: new RegExp(`^((?!(${txt})).)*$`, 'g'), message: format(message, { list: list.join('/') }) };
      },
      // 包含中文
      includeZh (message) {
        return { transform: String, pattern: /[\u4e00-\u9fa5]+/g, message };
      },
      // 只能包含中文
      onlyZh (message) {
        return { transform: String, pattern: /^[\u4e00-\u9fa5]+$/, message };
      },
      // 不能包含中文
      excludeZh (message) {
        return { transform: String, pattern: /^[^\u4e00-\u9fa5]+$/, message };
      },
      // 只能是双字节
      maybeDByte (message) {
        return { pattern: /[^\x00-\xff]+$/, message };
      },
      pattern (pattern, message) {
        return { pattern, transform: String, message: format(message, { pattern }) };
      },
      // int
      int (message) {
        return { type: 'integer', transform: Number, message };
      },
      float (message) {
        return { type: 'float', transform: Number, message };
      },
      /* 类型验证 */
      email (message) {
        return { type: 'email', message };
      },
      url (message) {
        return { type: 'url', message };
      },
      // 十六进制
      hex (message) {
        return { type: 'hex', message };
      },
      ip (message) {
        return { type: 'string', pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message };
      },
      color (message) {
        return { type: 'string', pattern: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, message };
      },
      // 自定义验证
      custom (fn, message) {
        if (!(fn instanceof Function)) {
          throw new Error('【配置错误】：fn必须为函数');
        }
        return { validator: fn, message };
      },
      // 远程验证
      remote ({
        url, query = {}, success, trigger = 'blur',
      } = {}) {
        if (!url) {
          throw new Error('【配置错误】：url必须不能为空');
        }
        if (success && !(success instanceof Function)) {
          throw new Error('【配置错误】：url必须不能为空');
        }
        return {
          trigger,
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
  },
};
