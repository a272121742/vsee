import { isInteger, isArray } from 'lodash';
import $ from '@http';

/**
 * 判断数字是否符合验证要求：
 * 1. 如果不是数字`Number`，返回`true`;
 * 2. 如果数字小于`0`，返回`true`;
 * @param {Number} num - 需要验证的数据
 */
const notAllowNumber = num => !isInteger(num) || (num <= 0);
const hasOwnProperty = (obj, property = '') => Object.prototype.hasOwnProperty.call(obj, property);
/**
 *
 * @param {*} vm
 * @param {*} fields
 * @param {*} path
 */
export const createFormFields = (vm, fields = [], path) => {
  const obj = vm[path] ? vm[path] : vm;
  const keys = fields.length ? fields : Object.keys(obj);
  const result = {};
  keys.forEach((key) => {
    result[key] = vm.$form.createFormField({ value: obj[key] });
  });
  return result;
};

export const autoUpdateFileds = (vm, path) => (props, values) => {
  const record = hasOwnProperty(vm, path) ? vm[path] : vm;
  const key = Object.keys(values)[0];
  record[key] = values[key] === void 0 ? null : values[key];
};

export const mapPropsToFields = (vm, fields = [], path) => () => {
  const obj = vm[path] ? vm[path] : vm;
  const keys = fields.length ? fields : Object.keys(obj);
  const result = {};
  keys.forEach((key) => {
    result[key] = vm.$form.createFormField({ value: obj[key] });
  });
  return result;
};

function format (str, replace = {}) {
  const keys = Object.keys(replace);
  let replaced = str;
  if (str) {
    keys.forEach((key) => {
      replaced = replaced.replace(new RegExp(`\\{\\{${  key  }\\}\\}`, 'g'), replace[key]);
    });
  }
  return replaced;
}

export const validator = {
  beforeCreate () {
    this.$v = {
      required (message) {
        return { required: true, message };
      },
      maxLength (max, message) {
        if (notAllowNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
 type: 'string', transform: String, max, message: format(message, { max }) 
};
      },
      minLength (min, message) {
        if (notAllowNumber(min)) {
          throw new Error('【配置错误】：min必须为数字');
        }
        return {
 type: 'string', transform: String, min, message: format(message, { min }) 
};
      },
      rangeLen (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
 type: 'string', transform: String, min, max, message: format(message, { min, max }) 
};
      },
      len (len, message) {
        if (notAllowNumber(len)) {
          throw new Error('【配置错误】：len必须为数字');
        }
        return {
 type: 'string', transform: String, len, message: format(message, { len }) 
};
      },
      max (max, message) {
        if (notAllowNumber(max)) {
          throw new Error('【配置错误】：max必须为数字');
        }
        return {
 type: 'number', transform: Number, max, message: format(message, { max }) 
};
      },
      min (min, message) {
        if (notAllowNumber(min)) {
          throw new Error('【配置错误】：min必须为数字');
        }
        return {
 type: 'number', min, transform: Number, message: format(message, { min }) 
};
      },
      range (range, message) {
        if (!isArray(range) || range.length !== 2) {
          throw new Error('【配置错误】：range必须为[min, max]类型数组');
        }
        const [min, max] = range;
        return {
 type: 'number', transform: Number, min, max, message: format(message, { min, max }) 
};
      },
      equal (value = '', message) {
        return { pattern: new RegExp(`^${value}$`, 'g'), message: format(message, { value }) };
      },
      enum (list, message) {
        if (!isArray(list) || !list.length) {
          throw new Error('【配置错误】：arr必须为不为空的数组');
        }
        return { type: 'enum', enum: list, message: format(message, { list: list.join('/') }) };
      },
      email (message) {
        return { type: 'email', message };
      },
      url (message) {
        return { type: 'url', message };
      },
      // 十六进制
      hex (hex, message) {
        return { type: 'hex', message };
      },
      int (message) {
        return { type: 'integer', transform: Number, message };
      },
      float (message) {
        return { type: 'float', transform: Number, message };
      },
      ip (message) {
        return { type: 'string', pattern: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g, message };
      },
      // 前缀判断
      prefix (txt = '', message) {
        return {
 type: 'string', transform: String, pattern: new RegExp(`^${txt}`, 'g'), message: format(message, { txt }) 
};
      },
      // 后缀判断
      suffix (txt = '', message) {
        return {
 type: 'string', transform: String, pattern: new RegExp(`${txt}$`, 'g'), message: format(message, { txt }) 
};
      },
      // 包含
      include (txt, message) {
        return {
 type: 'string', transform: String, pattern: new RegExp(`${txt}`, 'g'), message: format(message, { txt }) 
};
      },
      // 排除
      exclude (txt, message) {
        return {
 type: 'string', transform: String, pattern: new RegExp(`^((?!${txt}).)*$`, 'g'), message: format(message, { txt }) 
};
      },
      // 包含
      within (list, message) {
        if (!isArray(list) || !list.length) {
          throw new Error('【配置错误】：arr必须为不为空的数组');
        }
        const txt = list.map(item => `(${item})`).join('|');
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
      pattern (pattern, message) {
        return { pattern, transform: String, message: format(message, { pattern }) };
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
      maybeDByte (message) {
        return { pattern: /[^\x00-\xff]+/, message };
      },
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
      password (level = 1, message) {
        switch (level) {
        case 1:
          // 任何可见字符
          return { pattern: /^\S+$/, message };
        case 2:
          // 英文、数字组合
          return {
            pattern: /^[A-Za-z0-9][A-Za-z0-9]*$/,
            message,
          };
        case 3:
          // 英文、数字、有限特殊字符
          return { pattern: /^[a-zA-Z0-9~!@#$%^&*]+$/, message };
        case 4:
        default:
          return { pattern: /^\S+$/, message };
        }
      },
      // 远程验证
      remote (url, query = {}) {
        if (!url) {
          throw new Error('【配置错误】：url必须不能为空');
        }
        return {
 asyncValidator (rule, value, callback) {
          const params = JSON.parse(format(JSON.stringify(query), { value }));
          const api = format(url, { value });
          if (value) {
            $.get(api, params).then((res) => {
              if (res.code) {
                callback(res.msg);
              } else {
                callback();
              }
            }).catch((err) => {
              callback(err);
            });
          } else {
            callback();
          }
        } 
};
      },
    };
  },
};
