const project = process.env.npm_config_project;
const isProd = process.env.NODE_ENV === 'production';
// 数据加载模式（test: true - 联调模式； false - 本地模式）
const test = !!process.env.npm_config_test || isProd; // 以后生产环境默认开启

module.exports = config => {
  config.plugin('define')
    .tap(args => {
      args[0]['process.env'].test = test;
      args[0]['process.env'].project = JSON.stringify(project);
      console.log(args[0]['process.env']);
      return args;
    });
};
