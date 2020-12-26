import { HTTP } from '@lib/config.js';

const {
  RETRY_LIST,
  RETRY_DELAY,
} = HTTP;

/**
 * 请求重连
 */
export default !process.env.proxy ? void 0 : (axios) => {
  // 设置备用地址（若加上此备用地址列表，最坏情况下，会连接三次：默认连接、备用1、备用2）
  // 以下备用地址从配置文件中获取
  // 设置重连次数
  axios.defaults.retry = RETRY_LIST.length;
  // 设置重连间隔事件
  axios.defaults.retryDelay = RETRY_DELAY;
  // 注入重连钩子
  axios.interceptors.response.use(undefined, (err) => {
    // 获取连接配置
    const { config } = err;
    if (RETRY_LIST.length && !config.retry) {
      config.retry = RETRY_LIST.length;
    }
    // 如果不存在重连，reject
    if (!config || !config.retry) {
      return Promise.reject(err);
    }
    // 设置重连次数，初始化为0
    config.__retryCount = config.__retryCount || 0;
    console.info(
      `%c${config.__retryCount + 1}%c ${config.url}%c 请求失败，正在等待重连`,
      `color: #FFF; background: #F5222D; padding: 0 ${config.__retryCount < 9 ? 0.34 : 0.04}em; text-align: center; border-radius: 12px;`,
      'color: #4CAF50',
      'color: #062141; font-weight: bold',
    );

    // // 若没有填写baseURL，则备份api路径
    // if (!config.baseURL) {
    //   config.__url = config.url;
    // } else {
    //   config.__url = config.url.slice(config.baseURL.length - 1);
    // }
    // 如果超过重复次数，reject
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(err);
    }
    // 计数器
    config.__retryCount += 1;
    config.baseURL = RETRY_LIST[config.__retryCount - 1];
    // 返回重连信息
    return new Promise((resolve) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        resolve(config);
      }, RETRY_DELAY);
    }).then(axios);
  });
};
