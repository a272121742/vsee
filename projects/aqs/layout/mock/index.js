import mock from '@lib/mock.js';

const appCode = 'AQS';
mock.get('/sys/menu/nav', () => mock.result({
  code: 0,
  data: [{
    id: 12,
    appCode,
    createDate: Date.now(),
    icon: '',
    name: '车辆信息查询',
    parentName: '',
    permissions: '',
    pid: 0,
    resourceList: [],
    sort: 7,
    type: 0,
    url: 'vehicle',
  }, {
    id: 1000,
    appCode,
    name: '菜单1',
    url: 's1',
    children: [{
      id: 1001,
      appCode,
      name: '子菜单1',
      url: 'm1',
    }, {
      id: 1002,
      appCode,
      name: '详情',
      url: 'm1/detail/:id?',
    }, {
      id: 1003,
      appCode,
      name: '百度',
      url: 'http%3A%2F%2Fwww.baidu.com',
    }],
  }, {
    id: 2000,
    appCode,
    name: '菜单2',
    url: 's2',
    children: [{
      id: 2001,
      appCode,
      name: '子菜单1',
      url: 'm1',
    }, {
      id: 2002,
      appCode,
      name: '百度',
      url: 'http%3A%2F%2Fwww.baidu.com',
    }],
  }, {
    id: 3000,
    appCode,
    name: '菜单3',
    url: 's3',
    children: [{
      id: 3001,
      appCode,
      name: '详情',
      url: 'detail/:id?',
    }],
  }, {
    id: 4000,
    appCode,
    name: '菜单4',
    url: 's4',
    children: [{
      id: 4001,
      appCode,
      name: '',
      url: '',
    }],
  }, {
    id: 5000,
    appCode,
    name: '菜单5',
    url: 's5',
    children: [{
      id: 5001,
      appCode,
      name: '',
      url: '',
    }, {
      id: 5002,
      appCode,
      name: '子菜单一',
      url: 'm1',
    }],
  }, {
    id: 6000,
    appCode,
    name: '菜单6',
    url: 's6',
    children: [{
      id: 6001,
      appCode,
      name: '授权报表',
      url: 'http%3A%2F%2F106.75.63.69%3A37799%2Fwebroot%2Fdecision%2Flogin%2Fcross%2Fdomain%3Ffine_username%3Dadmin%26fine_password%3Dadmin%26validity%3D-1%26callback%3D/http%3A%2F%2F106.75.63.69%3A37799%2Fwebroot%2Fdecision%2Fv5%2Fdesign%2Freport%2Fa2bd81e6333b46c2af752823e2cc618b%2Fview',
    }, {
      id: 6002,
      appCode,
      name: 'BI',
      url: 'http%3A%2F%2Ffinebi.com',
    }],
  }, {
    id: 7000,
    appCode,
    name: '菜单7',
    url: 's7',
    children: [{
      id: 6001,
      appCode,
      name: '菜单7',
      url: 'http%3A%2F%2Fwww.baidu.com',
      children: [],
    }],
  }],
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
