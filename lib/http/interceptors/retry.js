// TODO: 变为可配置的
const netlist = ['https://easy-mock.com/mock/5b03c10305e00e7fd3cb3d68/example', 'http://rap2api.taobao.org/app/mock/116'];

/**
 * 请求重连
 */
export default (axios) => {
  // 设置备用地址（若加上此备用地址列表，最坏情况下，会连接三次：默认连接、备用1、备用2）
  // 以下备用地址从配置文件中获取
  // 设置重连次数
  axios.defaults.retry = netlist.length;
  // 设置重连间隔事件
  axios.defaults.retryDelay = 400;
  // 注入重连钩子
  axios.interceptors.response.use(undefined, (err) => {
    // 获取连接配置
    const { config } = err;
    // 如果不存在重连，reject
    if (!config || !config.retry) {
      return Promise.reject(err);
    }
    // 设置重连次数，初始化为0
    config.__retryCount = config.__retryCount || 0;
    // 若没有填写baseURL，则备份api路径
    if (!config.baseURL) {
      config.__url = config.url;
    } else {
      config.__url = config.url.slice(config.baseURL.length - 1);
    }
    // 如果超过重复次数，reject
    if (config.__retryCount >= config.retry) {
      // Reject with the error
      return Promise.reject(err);
    }
    // 计数器
    config.__retryCount += 1;
    config.baseURL = netlist[config.__retryCount - 1];
    config.url = config.__url;
    // 创造新的Promise来重连
    const backoff = new Promise(((resolve) => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1);
    }));
    // 返回重连信息
    return backoff.then(() => axios(config));
  });
};
