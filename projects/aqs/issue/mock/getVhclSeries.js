import mock from '@mock';
// import cdb from '@lib/cdb.js';

// const list = mock({
//   value: '@integer(1, 10)',
//   label: '@ctitle',
// }, 5);


mock.get('/v1/issue/bascfault', () => ({
  data: [{
    id: 1,
    name: '基本信息1',
  }, {
    id: 2,
    name: '基本信息2',
  }],
  code: 0,
}));
