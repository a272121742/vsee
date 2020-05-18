import mock from '@mock';

const appCode = 'AQS';
const baidu = encodeURIComponent('https://www.baidu.com');
const vue = encodeURIComponent('https://cn.vuejs.org');
const antd = encodeURIComponent('https://www.antdv.com/');
const authUrl = 'http%3A%2F%2F106.75.63.69%3A37799%2F%2FWebReport%2FReportServer%3Fop%3Dfs_load%26cmd%3Dsso%26fr_username%3Ddemo%26fr_password%3Ddemo/http%3A%2F%2F106.75.63.69%3A37799%2FWebReport%2FReportServer%3Fop%3Dfr_bi%26cmd%3Dbi_init%26id%3D144%26createBy%3D-999%26show%3D_bi_show';
mock.get('/sys/menu/nav', () => mock.result({
  code: 0,
  data: [{
    id: 1000,
    appCode,
    name: '一级菜单(独立)',
    url: 's1',
  }, {
    id: 2000,
    appCode,
    name: '二级菜单(独立)',
    url: 's2',
    children: [{
      id: 2001,
      appCode,
      name: '子菜单1',
      url: 'm1',
    }, {
      id: 2002,
      appCode,
      name: '子菜单2',
      url: 'm2',
    }],
  }, {
    id: 3000,
    appCode,
    name: '二级菜单(混合报表)',
    url: 's3',
    children: [{
      id: 3001,
      appCode,
      name: '子菜单',
      url: 'm1',
    }, {
      id: 3002,
      appCode,
      name: '百度',
      url: baidu,
    }],
  }, {
    id: 4000,
    appCode,
    name: '二级路由(纯报表)',
    url: 's4',
    children: [{
      id: 4001,
      appCode,
      name: '百度',
      url: baidu,
    }, {
      id: 4002,
      appCode,
      name: 'Vue',
      url: vue,
    }],
  }, {
    id: 5000,
    appCode,
    name: '一级菜单(进阶)',
    url: 's5',
    children: [{
      id: 5001,
      appCode,
      name: '一级菜单(进阶)',
      url: '',
    }],
  }, {
    id: 6000,
    appCode,
    name: '一级菜单(隐藏路由)',
    url: 's6',
    children: [{
      id: 6001,
      appCode,
      name: '新增（隐藏路由）',
      url: 'd1',
    }],
  }, {
    id: 7000,
    appCode,
    name: '二级菜单(隐藏菜单)',
    url: 's7',
    children: [{
      id: 7001,
      appCode,
      name: '菜单1',
      url: 'm1',
    }, {
      id: 7002,
      appCode,
      name: '新增',
      url: 'm1/d1',
    }],
  }, {
    id: 8000,
    appCode,
    name: '一级参数路由',
    url: 's8',
    children: [{
      id: 8001,
      appCode,
      name: '详情',
      url: 'd/:id?',
    }],
  }, {
    id: 9000,
    appCode,
    name: '二级参数路由',
    url: 's9',
    children: [{
      id: 9001,
      appCode,
      name: '菜单',
      url: 'm1',
    }, {
      id: 9002,
      appCode,
      name: '详情',
      url: 'm1/d/:id?',
    }],
  }, {
    id: 10000,
    appCode,
    name: '报表进阶',
    url: 's10',
    children: [{
      id: 10001,
      appCode,
      name: '报表进阶',
      url: antd,
    }],
  }, {
    id: 11000,
    appCode,
    name: '授权报表',
    url: 's11',
    children: [{
      id: 11001,
      appCode,
      name: '授权报表',
      url: authUrl,
    }],
  }, {
    id: 12000,
    appCode,
    name: '一级菜单（共三级）',
    url: 's12',
    children: [{
      id: 12010,
      appCode,
      name: '二级菜单（共三级）',
      url: 'm1',
      children: [{
        id: 12011,
        appCode,
        name: '三级菜单（共三级）',
        url: 'd1',
      }, {
        id: 12012,
        appCode,
        name: '三级菜单2（共三级）',
        url: 'd2',
      }],
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
