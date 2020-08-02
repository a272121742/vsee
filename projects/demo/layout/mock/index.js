import mock from '@mock';

const appCode = 'AQS';
const baidu = encodeURIComponent('https://www.baidu.com');
const vue = encodeURIComponent('https://cn.vuejs.org');
const antd = encodeURIComponent('https://www.antdv.com/');
const authUrl = 'http%3A%2F%2F106.75.63.69%3A37799%2F%2FWebReport%2FReportServer%3Fop%3Dfs_load%26cmd%3Dsso%26fr_username%3Ddemo%26fr_password%3Ddemo/http%3A%2F%2F106.75.63.69%3A37799%2FWebReport%2FReportServer%3Fop%3Dfr_bi%26cmd%3Dbi_init%26id%3D144%26createBy%3D-999%26show%3D_bi_show';
mock.get('/sys/menu/nav', () => mock.result({
  code: 0,
  data: [{
  //   id: 100000000,
  //   appCode,
  //   name: '测试案例',
  //   url: 'demo',
  //   icon: 'unordered-list',
  //   pid: null,
  // }, {
    id: 1000,
    appCode,
    name: '一级菜单(独立)',
    url: 's1',
    icon: 'unordered-list',
    pid: null,
  }, {
    id: 2000,
    appCode,
    name: '二级菜单(独立)',
    url: 's2',
    icon: 'unordered-list',
    children: [{
      id: 2001,
      appCode,
      name: '子菜单1',
      url: 'm1',
      pid: 2000,
    }, {
      id: 2002,
      appCode,
      name: '子菜单2',
      url: 'm2',
      pid: 2000,
    }],
  }, {
    id: 3000,
    appCode,
    name: '二级菜单(混合报表)',
    url: 's3',
    icon: 'unordered-list',
    children: [{
      id: 3001,
      appCode,
      name: '子菜单',
      url: 'm1',
      pid: 3000,
    }, {
      id: 3002,
      appCode,
      name: '百度',
      url: baidu,
      pid: 3000,
    }],
  }, {
    id: 4000,
    appCode,
    name: '二级路由(纯报表)',
    url: 's4',
    icon: 'unordered-list',
    children: [{
      id: 4001,
      appCode,
      name: '百度',
      url: baidu,
      pid: 4000,
    }, {
      id: 4002,
      appCode,
      name: 'Vue',
      url: vue,
      pid: 4000,
    }],
  }, {
    id: 5000,
    appCode,
    name: '二级菜单(非进阶)',
    url: 's5',
    icon: 'unordered-list',
    // children: [{
    //   id: 5001,
    //   appCode,
    //   name: '子菜单(非进阶)',
    //   url: '',
    //   pid: 5000,
    // }],
  }, {
    id: 6000,
    appCode,
    name: '一级菜单(隐藏路由)',
    url: 's6',
    icon: 'unordered-list',
    children: [{
    //   id: 6001,
    //   appCode,
    //   name: '一级菜单(隐藏路由)',
    //   url: '',
    //   pid: 6000,
    // }, {
      id: 6002,
      appCode,
      name: '新增（隐藏路由）',
      url: 'd1',
      pid: 6000,
    }],
  }, {
    id: 7000,
    appCode,
    name: '二级菜单(隐藏菜单)',
    url: 's7',
    icon: 'unordered-list',
    children: [{
      id: 7001,
      appCode,
      name: '菜单1',
      url: 'm1',
      pid: 7000,
      children: [{
        id: 7003,
        appCode,
        name: '新增',
        url: 'd1',
        pid: 7001,
      }],
    }],
  }, {
    id: 8000,
    appCode,
    name: '一级参数路由',
    url: 's8',
    icon: 'unordered-list',
    children: [{
      id: 8001,
      appCode,
      name: '一级参数路由',
      url: '',
      pid: 8000,
    }, {
      id: 8002,
      appCode,
      name: '详情',
      url: 'd/:id?',
      pid: 8000,
    }],
  }, {
    id: 9000,
    appCode,
    name: '二级参数路由',
    url: 's9',
    icon: 'unordered-list',
    children: [{
      id: 9001,
      appCode,
      name: '菜单',
      url: 'm1',
      pid: 9000,
      children: [{
        id: 9002,
        appCode,
        name: '详情',
        url: 'd/:id?',
        pid: 9001,
      }],
    }],
  }, {
    id: 10000,
    appCode,
    name: '报表进阶',
    url: antd,
    icon: 'unordered-list',
    // children: [{
    //   id: 10001,
    //   appCode,
    //   name: '报表进阶',
    //   url: antd,
    //   pid: 10000,
    // }],
  }, {
    id: 11000,
    appCode,
    name: '授权报表',
    url: 's11',
    icon: 'unordered-list',
    children: [{
      id: 11001,
      appCode,
      name: '授权报表',
      url: authUrl,
      pid: 11000,
    }],
  }, {
    id: 12000,
    appCode,
    name: '一级菜单（共三级）',
    url: 's12',
    icon: 'unordered-list',
    children: [{
      id: 12010,
      appCode,
      name: '二级菜单（共三级）',
      url: 'm1',
      pid: 12000,
      children: [{
        id: 12011,
        appCode,
        name: '三级菜单1（共三级）',
        url: 'd1',
        pid: 12011,
      }, {
        id: 12012,
        appCode,
        name: '三级菜单2（共三级）',
        url: 'd2',
        pid: 12011,
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

mock.get('/test/list', () => ({
  data: [{ id: '0', name: 'EC3' }, { id: '1', name: 'EX2' }],
  code: 0,
}), { timeout: 1000 });
