import qs from 'qs';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { transLanguage } from '@util/localhelper.js';
import store from '@store';

import proxy from './proxy.js';
import resolve from './resolve.js';
import reject from './reject.js';

import {
  TOKEN_KEY, LANGUAGE_KEY,
} from '~/config.js';

const isProd = process.env.NODE_ENV === 'production';
const nothing = () => {};

const axios = Axios.create({
  baseURL: isProd ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI,
  headers: {
    token: Cookies.get(TOKEN_KEY),
    Authorization: Cookies.get(TOKEN_KEY),
    'Accept-Language': transLanguage(Cookies.get(LANGUAGE_KEY)),
  },
  timeout: 10000,
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'comma' }),
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
    return http.get(url, { ...config, params }).then(resolve).catch(reject);
  },
  delete (url, params, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.delete(url, { ...config, params }).then(resolve).catch(reject);
  },
  head (url, params, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.head(url, { ...config, params }).then(resolve).catch(reject);
  },
  post (url, data, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.post(url, data, { ...config }).then(resolve).catch(reject);
  },
  put (url, data, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.put(url, data, { ...config }).then(resolve).catch(reject);
  },
  patch (url, data, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.patch(url, data, { ...config }).then(resolve).catch(reject);
  },
  options (url, params, config = {}) {
    const http = store.state.isMock ? proxy : axios;
    return http.options(url, { ...config, params }).then(resolve).catch(reject);
  },
  request (config) {
    const http = store.state.isMock ? proxy : axios;
    return http.request(config).then(resolve).catch(reject);
  },
};
