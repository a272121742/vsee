import Cookies from 'js-cookie';
import { tap } from 'ramda';
import { tapclone } from '@util/fnhelper.js';
import { transLanguage } from '@util/localhelper.js';
import config from '~/config.js';

const {
  TOKEN_KEY, LANGUAGE_KEY, OTHER_GET_PARAMS, TOKEN_AUTOSET,
} = config;

const isProd = process.env.NODE_ENV === 'production';

/**
 * 登录拦截器，在登录成功之后，设置登录信息；
 */

/**
 * 登陆之后
 * 1. 所有的`response`将更新`token`；
 * @param {*} axios
 */
export default (axios) => {
  // 1. 登录后的`response`将更新`token`；
  axios.interceptors.response.use(tapclone((res) => {
    // 登陆业务中会获取服务端的`token`信息;
    if (res.config && ~res.config.url.indexOf('/auth/login')) {
      const token = (res.data && res.data.data && res.data.data.token);
      // const expires = (res.data && res.data.data && res.data.data.expire) || 7;
      if (token) {
        Cookies.remove(TOKEN_KEY);
        if (TOKEN_AUTOSET) {
          Cookies.set(TOKEN_KEY, token);
        }
        axios.defaults.headers.token = token;
        axios.defaults.headers.Authorization = token;
      }
    }
  }));
  axios.interceptors.request.use(tap((req) => {
    // 如果请求时没有token，则跳出系统进行登陆；
    if (isProd && process.env.proxy && !~req.url.indexOf('auth')) {
      if (!Cookies.get(TOKEN_KEY)) {
        Cookies.remove(TOKEN_KEY);
        window.location.href = '/';
      }
    }
    const language = transLanguage(Cookies.get(LANGUAGE_KEY));
    req.headers['Accept-Language'] = language;
    req.headers['Content-Type'] = 'application/json;charset=utf-8';
    if (req.method === 'get') {
      req.data = { unused: 0 };
      req.params = {
        ...req.params,
        ...OTHER_GET_PARAMS,
      };
    }
  }));
};
