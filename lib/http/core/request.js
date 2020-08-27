import qs from 'qs';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { transLanguage } from '@util/localhelper.js';
import { HTTP } from '@lib/config.js';
import config from '~/config.js';


const {
  TIMEOUT,
  HEADER,
  PROXY,
  PARAMS_SERIALIZER,
} = HTTP;
const {
  LANGUAGE_KEY = 'language',
  TOKEN_KEY = 'login_token',
} = config;

const isProd = process.env.NODE_ENV === 'production';

export default Axios.create({
  // baseURL: (isProd && isProxy) ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI,
  name: isProd ? '生产网络' : '开发网络',
  baseURL: isProd ? process.env.VUE_APP_GATEWAY : PROXY || process.env.VUE_APP_PIXAPI,
  headers: {
    'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=0,no-siteapp,post-check=0,pre-check=0',
    Pragma: 'no-cache',
    ...HEADER,
    token: Cookies.get(TOKEN_KEY),
    Authorization: Cookies.get(TOKEN_KEY),
    'Accept-Language': transLanguage(Cookies.get(LANGUAGE_KEY)),
  },
  timeout: TIMEOUT,
  paramsSerializer: (params) => qs.stringify(params, PARAMS_SERIALIZER),
});
