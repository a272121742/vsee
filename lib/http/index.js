import qs from 'qs';
import Axios from 'axios';
import store from '@store';
import { omit } from 'ramda';

import request from './core/request.js';
// import staticd from './static';
import proxy from './core/proxy.js';
import resolved from './core/resolve.js';
import rejected from './core/reject.js';
import download from './download.js';

const ajax = Axios.create({
  name: 'ajax',
});

// const isProxy = process.env.proxy;
const nothing = () => {};
// const isStatic = (path) => /^\/static\/\S+/i.test(path);

const axios = request;

const interceptorsReq = require.context('./interceptors', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\.js$/);
interceptorsReq
  .keys()
  .forEach((mod) => {
    const interceptor = interceptorsReq(mod);
    const inject = interceptor.default || nothing;
    const useProxy = !!interceptor.proxy;
    inject(useProxy ? proxy : axios);
  });

export default {
  get (url, params, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.get(url, { ...conf, params }).then(resolved).catch(rejected);
  },
  delete (url, params, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.delete(url, { ...conf, params }).then(resolved).catch(rejected);
  },
  head (url, params, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.head(url, { ...conf, params }).then(resolved).catch(rejected);
  },
  options (url, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.options(url, omit(['data'], conf)).then(resolved).catch(rejected);
  },
  post (url, data, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.post(url, data, omit(['data'], conf)).then(resolved).catch(rejected);
  },
  put (url, data, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.put(url, data, omit(['data'], conf)).then(resolved).catch(rejected);
  },
  patch (url, data, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.patch(url, data, omit(['data'], conf)).then(resolved).catch(rejected);
  },
  // 给其他代理接口使用
  request (conf) {
    return ajax.request(conf);
  },
  jsonp (url, params = {}, callback = 'callback') {
    const callbackName = callback + Date.now();
    return new Promise((resolve, reject) => {
      const jsonp = document.createElement('script');
      window[callbackName] = (result) => {
        resolve(result);
        setTimeout(() => {
          delete window[callbackName];
          document.getElementsByTagName('head')[0].removeChild(jsonp);
        }, 1000);
      };
      jsonp.onerror = () => {
        reject(new Error('jsonp error'));
        setTimeout(() => {
          delete window[callbackName];
          document.getElementsByTagName('head')[0].removeChild(jsonp);
        }, 1000);
      };
      params[callback] = callbackName;
      params._t = Date.now();
      jsonp.type = 'text/javascript';
      jsonp.async = true;
      jsonp.src = `${url}?${qs.stringify(params)}`;
      document.getElementsByTagName('head')[0].appendChild(jsonp);
    });
  },
  /**
   * 不支持相对路径，只能绝对路径
   * 可以是绝对路径的地址，例如 /static/file.txt
   * 可以是绝对路径的接口，例如 /bar/foo?name=name&url=url
   * @param {*} url
   * @param {*} params
   */
  download (url) {
    download(url);
  },
};
