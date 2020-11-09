import { compile, pathToRegexp } from 'path-to-regexp';

import $ from '@http';
import { reverse } from '@util/fnhelper.js';

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
  const toPath = compile(url, { encode: encodeURIComponent });
  const fn = reverse(([params, ...paths]) => {
    const reversePaths = [].reverse.call(paths);
    const requestUrl = toPath(keys.reduce((result, item, index) => {
      result[item.name] = reversePaths[index];
      return result;
    }, {}));
    return $[type](requestUrl, params);
  });
  fn.url = url;
  fn.type = type;
  fn.pathData = pathData;
  fn.reqData = reqData;
  fn.resData = resData;
  fn.desc = desc;
  map[url] = fn;
  return fn;
}

export default map;

export {
  apiDefineder,
};
