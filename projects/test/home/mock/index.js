import mock from '@lib/mock.js';

mock.get('/getdata', () => {
  return mock.result({
    data: [{
      title: '项目一',
      value: 'value1'
    }, {
      title: '项目二',
      value: 'value2'
    }]
  });
}, { timeout: 2000 });

mock.get('/gettree', () => {
  return mock.result({
    data: [{
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [{
        value: '0-0-1',
        key: '0-0-1',
        scopedSlots: { // custom title
          title: 'title'
        }
      }, {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2'
      }]
    }, {
      title: 'Node2',
      value: '0-1',
      key: '0-1'
    }]
  });
}, { timeout: 2000 });

mock.get('/remote/vali', ({ value = '' }) => {
  const flag = ['北京', '上海', '深圳'].some(item => item === value);
  return {
    code: flag ? 0 : 1000,
    msg: flag ? void 0 : '不包含在北京、上海、深圳中'
  };
});
