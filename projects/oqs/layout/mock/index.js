import mock from '@mock';

const appCode = 'OQS';
mock.get('/sys/menu/nav', () => mock.result({
  code: 0,
  data: [
    {
      id: 1000,
      appCode,
      name: 'DEMO',
      nameZh: '',
      url: 'demo',
      children: [{
        id: 1001,
        appCode,
        name: '车辆信息查询',
        nameZh: '车辆信息查询',
        url: 'vehicleProfile',
      }, {
        id: 1002,
        appCode,
        name: '过点信息',
        nameZh: '过点信息',
        url: 'checkpoint',
      }],
    },
  ],
}));


mock.get('/sys/user/info', () => mock.result({
  data: {
    realName: '模拟系统测试管理员账户超长名称',
    name: 'TEST ADMINISTRATOR ACCOUNT',
  },
  code: 0,
}));

mock.get('/sys/menu/permissions', () => mock.result({
  data: {},
  code: 0,
}));
