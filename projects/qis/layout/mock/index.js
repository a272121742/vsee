import mock from '@lib/mock.js';
import { Random } from 'mockjs';

mock.get('/auth/captcha', (uuid) => {
  console.log('发送图片', uuid);
  return Random.dataImage('128x38', Random.string('lower', 6));
});

mock.get('/sys/menu/nav', () => mock.result({
  data: [{
    id: 1,
    appCode: 'ISSUE',
    createDate: Date.now(),
    icon: '',
    name: '首页',
    parentName: '',
    permissions: '',
    pid: 0,
    resourceList: [],
    sort: 0,
    type: 0,
    url: '/',
  }, {
    id: 2,
    appCode: 'ISSUE',
    createDate: Date.now(),
    icon: '',
    name: '我的问题',
    parentName: '',
    permissions: '',
    pid: 0,
    resourceList: [],
    sort: 0,
    type: 0,
    url: '/question/list',
  }, {
    id: 3,
    appCode: 'ISSUE',
    createDate: Date.now(),
    icon: '',
    name: '问题检索',
    parentName: '',
    permissions: '',
    pid: 0,
    resourceList: [],
    sort: 0,
    type: 0,
    url: '/question/search',
  }],
}));

mock.get('/sys/user/info', () => mock.result({
  data: {},
}));
mock.get('/sys/menu/permissions', () => mock.result({
  data: ['qis:list:create'],
}));
