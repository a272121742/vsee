import Cookies from 'js-cookie';
import { tap } from 'ramda';
import { tapclone } from '@util/fnhelper.js';
import { transLanguage } from '@util/localhelper.js';
import config from '~/config.js';

const {
  TOKEN_KEY = 'login_token',
  LANGUAGE_KEY = 'language',
  OTHER_GET_PARAMS = {},
  TOKEN_CUSTSET = false,
  AUTH_LOGIN_API = { URL: '/auth/login' },
  SKIP_LOGIN = false,
  PORTAL_PATH = '/',
  SKIP_API_LIST = [],
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
    if (res.config && ~res.config.url.indexOf(AUTH_LOGIN_API.URL)) {
      const data = (res.data && res.data.data) || {};
      const { token, expires } = data;
      if (token) {
        Cookies.remove(TOKEN_KEY);
        if (!TOKEN_CUSTSET) {
          Cookies.set(TOKEN_KEY, token, expires ? data : void 0);
        }
        axios.defaults.headers.token = token;
        axios.defaults.headers.Authorization = token;
      }
    }
  }));
  !SKIP_LOGIN && axios.interceptors.request.use(tap((req) => {
    // 如果请求时没有token，则跳出系统进行登陆；
    if (isProd && process.env.proxy && !~req.url.indexOf('auth') && !SKIP_API_LIST.includes(req.url)) {
      if (!Cookies.get(TOKEN_KEY)) {
        Cookies.remove(TOKEN_KEY);
        window.location.replace(PORTAL_PATH);
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
