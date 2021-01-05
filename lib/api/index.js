import { compile, pathToRegexp } from 'path-to-regexp';
import { slice } from 'ramda';
import $ from '@http';

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: false,
};

const map = (() => {
  let instance = null;
  function ApiMap () {
    return instance || this;
  }
  Object.defineProperties(ApiMap.prototype, {
    keys: {
      ...propertiesConfig,
      value () {
        return Object.keys(this);
      },
    },
    values: {
      ...propertiesConfig,
      value () {
        return Object.values(this);
      },
    },
  });
  instance = new ApiMap();
  return instance;
})();

function apiDefineder ({
  url = '', type = 'get', reqData, resData, pathData = {}, desc = '暂无说明',
}) {
  console.error('此方法将更名为 apiDefiner ，各个开发者请立即更换，后续会删除此过时的方法名称');
  if (!url) {
    throw new Error('【配置错误】apiDefineder中url不能为空');
  }
  if (!['get', 'post', 'patch', 'put', 'delete', 'head', 'options'].includes(type)) {
    throw new Error('【配置错误】apiDefineder中type配置不合法');
  }
  const keys = [];
  pathToRegexp(url, keys, {
    sensitive: true,
    strict: true,
  });
  const keysLen = keys.length;
  const toPath = compile(url, { encode: encodeURIComponent });
  const fn = (...args) => {
    const paths = slice(0, keysLen, args);
    const params = args[keysLen];
    const requestUrl = toPath(keys.reduce((result, item, index) => {
      result[item.name] = paths[index];
      return result;
    }, {}));
    return $[type](requestUrl, params);
  };
  fn.url = url;
  fn.type = type;
  fn.pathData = pathData;
  fn.reqData = reqData;
  fn.resData = resData;
  fn.desc = desc;
  map[url] = fn;
  return fn;
}

function apiDefiner ({
  title, url = '', type = 'get', reqData, resData, pathData = {}, desc = '暂无说明', config,
}) {
  if (!url) {
    throw new Error('【配置错误】apiDefiner中url不能为空');
  }
  if (!['get', 'post', 'patch', 'put', 'delete', 'download'].includes(type)) {
    throw new Error('【配置错误】apiDefiner中type配置不合法');
  }
  const keys = [];
  pathToRegexp(url, keys, {
    sensitive: true,
    strict: true,
  });
  const keysLen = keys.length;
  const toPath = compile(url, { encode: encodeURIComponent });
  const fn = (...args) => {
    const paths = slice(0, keysLen, args);
    const params = args[keysLen];
    const requestUrl = toPath(keys.reduce((result, item, index) => {
      result[item.name] = paths[index];
      return result;
    }, {}));
    return $[type](requestUrl, params, config);
  };
  fn.title = title;
  fn.url = url;
  fn.type = type;
  fn.pathData = pathData;
  fn.reqData = reqData;
  fn.resData = resData;
  fn.desc = desc;
  fn.config = config;
  map[url] = fn;
  return fn;
}

export default map;

export {
  apiDefineder,
  apiDefiner,
};
