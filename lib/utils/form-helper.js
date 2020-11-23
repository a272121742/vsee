import { FORM } from '@lib/config.js';
import { map } from 'ramda';
import {
  isInteger, isNumber, isArray, isEqual,
} from 'lodash';
import tinycolor from 'tinycolor2';
import { divide } from 'number-precision';

const {
  TRIGGER: trigger,
  VALIDATION,
} = FORM;

const custValidation = map((pattern) => {
  if (pattern instanceof RegExp) {
    return (message) => ({ pattern, message });
  }
  throw new Error('【配置错误】：自定义验证必须为正则表达式');
}, VALIDATION);

export default {
  install (Vue) {
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
        if (!isNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          trigger, type: 'number', transform: trasformNumber, max, message: format(message, { max }),
        };
      },
      // value <= max
      lte (max, message) {
        if (!isNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          trigger, type: 'number', transform: trasformNumber, max, message: format(message, { max }),
        };
      },
      // value < max
      lt (max, message) {
        if (!isNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          trigger, type: 'number', transform: trasformNumber, validator: (rule, val) => val < max, message: format(message, { max }),
        };
      },
      // value >= min
      min (min, message) {
        if (!isNumber(min)) {
          throw new Error('【配置错误】：min必须为数字');
        }
        return {
          trigger, type: 'number', transform: trasformNumber, min, message: format(message, { min }),
        };
      },
      gte (min, message) {
        if (!isNumber(min)) {
          throw new Error('【配置错误】：min必须为数字');
        }
        return {
          trigger, type: 'number', transform: trasformNumber, min, message: format(message, { min }),
        };
      },
      // value > min
      gt (min, message) {
        if (!isNumber(min)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
          trigger, type: 'number', transform: trasformNumber, validator: (rule, val) => val > min, message: format(message, { min }),
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
          trigger, type: 'number', transform: trasformNumber, min, max, message: format(message, { min, max }),
        };
      },
      // value < min || value > max
      outof (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          trigger, type: 'number', transform: trasformNumber, validator: (rule, val) => val < min || val > max, message: format(message, { min, max }),
        };
      },
      // min < value < max
      gtlt (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          trigger, type: 'number', transform: trasformNumber, validator: (rule, val) => val > min && val < max, message: format(message, { min, max }),
        };
      },
      // min <= value < max
      lgte (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          trigger, type: 'number', transform: trasformNumber, validator: (rule, val) => val >= min && val < max, message: format(message, { min, max }),
        };
      },
      // min < value <= max
      glte (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
          trigger, type: 'number', transform: trasformNumber, validator: (rule, val) => val > min && val <= max, message: format(message, { min, max }),
        };
      },
      // 整除的
      divisible (value, message) {
        return {
          trigger, type: 'integer', transform: (val) => divide(trasformNumber(val), trasformNumber(value)), message: format(message, { value }),
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
      zh (message) {
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
          trigger,
          type: 'integer',
          transform: trasformIntNumber,
          message,
        };
      },
      float (message) {
        return {
          trigger, type: 'float', transform: trasformNumber, message,
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
      ip4 (message) {
        return {
          trigger, type: 'string', pattern: /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.){4}$/, message,
        };
      },
      ip6 (message) {
        return {
          trigger, type: 'string', pattern: /^(([\da-fA-F]{1,4}):){8}$/, message,
        };
      },
      color (message) {
        return {
          trigger,
          type: 'string',
          validator (rule, value) {
            return tinycolor(value).isValid();
          },
          message,
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
        url, query = {}, validate, callback: finallyFn = Function.prototype, trigger: remoteTrigger = 'blur',
      } = {}) {
        if (!url || typeof url !== 'string') {
          throw new Error('【配置错误】：url必须不能为空');
        }
        if (validate && !(validate instanceof Function)) {
          throw new Error('【配置错误】：validate必须为函数');
        }
        return {
          trigger: remoteTrigger,
          asyncValidator (rule, value, callback) {
            const params = JSON.parse(format(JSON.stringify(query), { value }));
            const api = format(url, { value });
            if (value) {
              import('@http').then(({ default: $ }) => {
                $.get(api, params).then((res) => {
                  const result = validate ? validate(res) : res;
                  if (result === true) {
                    callback();
                  } else {
                    callback(result);
                  }
                }).catch((err) => {
                  callback(err);
                }).finally(finallyFn);
              });
            }
          },
        };
      },
    };
  },
};

// 验证number
function numberFalse (value) {
  return (value !== 0 && !value);
}
function trasformNumber (value) {
  return (numberFalse(value) ? null : Number(value));
}
function trasformIntNumber (value) {
  return (numberFalse(value) ? null : /^\d*\.$/.test(value) ? value : Number(value));
}

/**
 * 判断数字是否符合验证要求：
 * 1. 如果不是数字`Number`，返回`true`;
 * 2. 如果数字小于`0`，返回`true`;
 * @param {Number} num - 需要验证的数据
 */
function notAllowNumber (num) {
  return !isInteger(num) || (num < 0);
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
