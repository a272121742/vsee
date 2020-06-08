/**
 *  表单混入器
 */
import { validator } from '@util/formhelper.js';
import { clearObserver } from '@util/datahelper.js';
import Vue from 'vue';

const hasOwnProperty = (obj, property) => Object.prototype.hasOwnProperty.call(obj, property);


const FormRecord = ((function createFormWithCache () {
  const formRecordCache = {};
  function recordConstructor (record) {
    Object.assign(this, record);
    Vue.observable(this);
    formRecordCache[this] = record;
  }
  /**
   * 设置表单值
   * @param {*} values - 值
   * @param {*} put - 是否替换更新，默认`false`，设置为`true`时，`values`将覆盖原有`form`对象
   */
  recordConstructor.prototype.set = function set (values = {}, put = false) {
    const keys = Object.keys(values);
    if (put) {
      this.clear();
    }
    keys.forEach((key) => {
      if (hasOwnProperty(this, key)) {
        this[key] = values[key];
      } else {
        Vue.set(this, key, values[key]);
      }
    });
  };

  /**
   * 装载表单值，`set(values, true)`的别名
   * @param {*} values - 值
   */
  recordConstructor.prototype.load = function load (values = {}) {
    this.set(values, true);
  };

  /**
   * 缓存表单值
   */
  recordConstructor.prototype.cache = function cache () {
    formRecordCache[this] = clearObserver(this);
  };

  /**
   * 清空表单值
   */
  recordConstructor.prototype.clear = function clear () {
    const keys = Object.keys(this);
    keys.forEach((key) => {
      if (hasOwnProperty(this, key)) {
        this[key] = null;
      } else {
        Vue.set(this, key, null);
      }
    });
  };

  /**
   * 重置表单值
   */
  recordConstructor.prototype.reset = function reset () {
    Object.assign(this, { ...formRecordCache[this] });
  };
  return recordConstructor;
}).call(void 0));


export default (recordName = 'record') => {
  const record = {};
  return {
    mixins: [validator],
    data () {
      return {
        [recordName]: {},
      };
    },
    created () {
      this.$set(this, recordName, new FormRecord({ ...record, ...this[recordName] }));
      this[recordName].cache();
    },
  };
};
