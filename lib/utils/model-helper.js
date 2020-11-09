import { clone } from 'ramda';

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: false,
};

export default void 0;

function TableModel (name) {
  if (!(this instanceof TableModel)) {
    throw new Error('TableModel不是调用函数，请使用new关键字进行实例化！');
  }
  this.dataIndex = name;
  this.scopedSlots = {
    customRender: name,
  };
}

Object.defineProperties(TableModel.prototype, {
  mix: {
    ...propertiesConfig,
    value (configs = {}) {
      return { ...clone(this), ...clone(configs) };
    },
  },
});

function tableModelDefinder (name) {
  if (!name || typeof name !== 'string') {
    throw new Error('【配置错误】tableModelDefinder中name不能为空');
  }
  return new TableModel(name);
}

export {
  tableModelDefinder,
};
