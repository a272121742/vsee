import qs from 'qs';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { transLanguage } from '@util/localhelper.js';
import store from '@store';

import staticd from './static';
import proxy from './proxy.js';
import resolved from './resolve.js';
import rejected from './reject.js';

import config from '~/config.js';

const { LANGUAGE_KEY, TOKEN_KEY } = config;

const isProd = process.env.NODE_ENV === 'production';
const isProxy = process.env.proxy;
const nothing = () => {};
const isStatic = (path) => /^\/static\/\S+/i.test(path);

const axios = Axios.create({
  baseURL: (isProd && isProxy) ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI,
  headers: {
    token: Cookies.get(TOKEN_KEY),
    Authorization: Cookies.get(TOKEN_KEY),
    'Accept-Language': transLanguage(Cookies.get(LANGUAGE_KEY)),
    'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=0,no-siteapp,post-check=0,pre-check=0',
    Pragma: 'no-cache',
  },
  timeout: 30000,
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
  get (url, params, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.get(url, { ...config, params }).then(resolved).catch(rejected);
  },
  delete (url, params, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.delete(url, { ...config, params }).then(resolved).catch(rejected);
  },
  head (url, params, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.head(url, { ...config, params }).then(resolved).catch(rejected);
  },
  post (url, data, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.post(url, data, { ...config }).then(resolved).catch(rejected);
  },
  put (url, data, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.put(url, data, { ...config }).then(resolved).catch(rejected);
  },
  patch (url, data, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.patch(url, data, { ...config }).then(resolved).catch(rejected);
  },
  options (url, params, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.options(url, { ...config, params }).then(resolved).catch(rejected);
  },
  request (config) {
    // const http = store.state.isMock ? proxy : axios;
    // return http.request(config).then(resolved).catch(rejected);
    return proxy.request(config).then(resolved).catch(rejected);
  },
  jsonp (url, params = {}, callback = 'callback') {
    const callbackName = callback + Date.now();
    return new Promise((resolve) => {
      const jsonp = document.createElement('script');
      window[callbackName] = (result) => {
        resolve(result);
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


    // const http = store.state.isMock ? proxy : axios;
    // return http.jsonp(url, { params });
  },
  /**
   * 不支持相对路径，只能绝对路径
   * 可以是绝对路径的地址，例如 /static/file.txt
   * 可以是绝对路径的接口，例如 /bar/foo?name=name&url=url
   * @param {*} url
   * @param {*} params
   */
  download (url, name, params) {
    const isStaticFile = isStatic(url);
    const http = store.state.isMock ? proxy : (isStaticFile ? staticd : axios);
  },
};
