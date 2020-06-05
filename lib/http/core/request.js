import qs from 'qs';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { transLanguage } from '@util/localhelper.js';
import store from '@store';
import { omit } from 'ramda';

// import staticd from './static';
import proxy from './proxy.js';
import resolved from './resolve.js';
import rejected from './reject.js';

import config from '~/config.js';

const {
  LANGUAGE_KEY = 'language',
  TOKEN_KEY = 'login_token',
  HTTP_HEADER = {},
  HTTP_TIMEOUT = 60000,
  DEV_PROXY,
} = config;

const isProd = process.env.NODE_ENV === 'production';
// const isProxy = process.env.proxy;
const nothing = () => {};
// const isStatic = (path) => /^\/static\/\S+/i.test(path);

const axios = Axios.create({
  // baseURL: (isProd && isProxy) ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI,
  name: isProd ? '生产网络' : '开发网络',
  baseURL: isProd ? process.env.VUE_APP_GATEWAY : DEV_PROXY,
  headers: {
    'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=0,no-siteapp,post-check=0,pre-check=0',
    Pragma: 'no-cache',
    ...HTTP_HEADER,
    token: Cookies.get(TOKEN_KEY),
    Authorization: Cookies.get(TOKEN_KEY),
    'Accept-Language': transLanguage(Cookies.get(LANGUAGE_KEY)),
  },
  timeout: HTTP_TIMEOUT,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
});

const interceptorsReq = require.context('../interceptors', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\.js$/);
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
  options (url, conf = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.options(url, omit(['params'], conf)).then(resolved).catch(rejected);
  },
  request (conf) {
    // const http = store.state.isMock ? proxy : axios;
    // return http.request(conf).then(resolved).catch(rejected);
    return proxy.request(conf).then(resolved).catch(rejected);
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
  // download (url, name, params) {
  //   const isStaticFile = isStatic(url);
  //   const http = store.state.isMock ? proxy : (isStaticFile ? staticd : axios);
  // },
};
