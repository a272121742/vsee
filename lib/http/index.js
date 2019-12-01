import qs from 'qs';
import Axios from 'axios';

import proxy from './proxy.js';
import resolve from './resolve.js';
import reject from './reject.js';

const interceptorsReq = require.context('./interceptors', true, /^\.\/[A-Za-z][A-Za-z0-9_]*\.js$/);
interceptorsReq
  .keys()
  .forEach(mod => {
    const inject = interceptorsReq(mod).default || new Function();
    inject(Axios);
  });



export default {
  get (url, params, config = {}) {
    return Axios.get(url, { ...config, params }).then(resolve).catch(reject);
  },
  delete (url, params, config = {}) {
    return Axios.delete(url, { ...config, params }).then(resolve).catch(reject);
  },
  head (url, params, config = {}) {
    return Axios.head(url, { ...config, params }).then(resolve).catch(reject);
  },
  post (url, data, config = {}) {
    return Axios.post(url, data, { ...config }).then(resolve).catch(reject);
  },
  put (url, data, config = {}) {
    return Axios.put(url, data, { ...config }).then(resolve).catch(reject);
  },
  patch (url, data, config = {}) {
    return Axios.patch(url, data, { ...config }).then(resolve).catch(reject);
  },
  options (url, params, config = {}) {
    return Axios.options(url, { ...config, params }).then(resolve).catch(reject);
  },
  request (config) {
    return Axios.request(config).then(resolve).catch(reject);
  }
};