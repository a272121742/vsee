import mock from '@mock';
import { Random } from 'mockjs';

mock.get('/auth/captcha', (uuid) => Random.dataImage('128x38', Random.string('lower', 6)));
mock.get('/auth/captcha/timeout', (uuid) => Random.dataImage('128x38', Random.string('lower', 6)), { timeout: 2500 });

mock.get('/net-select/base', () => ({
  data: [{ value: '10001', label: '选项1' }, { value: '10002', label: '选项2' }],
  code: 0,
}));

mock.get('/net-select/timeout', () => ({
  data: [{ value: '10001', label: '选项1' }, { value: '10002', label: '选项2' }],
  code: 0,
}), { timeout: 2500 });

mock.get('/net-select/uncache', () => {
  const num = parseInt(Math.random() * 100 % 4);
  const datas = [{ value: '10001', label: '选项1' }, { value: '10002', label: '选项2' }, { value: '10003', label: '选项3' }, { value: '10004', label: '选项4' }];
  return {
    data: datas.slice(0, num),
    code: 0,
  };
});

mock.get('/net-select/transform', () => ({
  data: [{ id: '10001', name: '选项1' }, { id: '10002', name: '选项2' }],
  code: 0,
}));

mock.get('/net-select/query', (param) => {
  const data = [
    { value: '10001', label: '选项1' },
    { value: '10002', label: '选项2' },
    { value: '10003', label: 'op3' },
    { value: '10004', label: 'op4' },
    { value: '10005', label: 'text5' },
    { value: '10006', label: 'text6' },
    { value: '10007', label: 'label7' },
    { value: '10008', label: 'label8' },
  ];
  const { id } = param;
  const { text } = param;
  const queryAll = !(id || text);
  const query = (id && ((item) => item.value === id)) || (text && ((item) => ~item.label.indexOf(text))) || ((item) => true);
  return {
    data: queryAll ? data : data.filter(query),
    code: 0,
  };
});

mock.get('/net-select/cascader', (param) => {
  const level1 = [
    { value: '10001', label: '上海' },
    { value: '10002', label: '北京' },
  ];
  const level2 = {
    10001: [
      { value: '20001', label: '徐汇' },
      { value: '20002', label: '闵行' },
    ],
    10002: [
      { value: '20003', label: '五道口' },
      { value: '20004', label: '天安门' },
    ],
  };
  console.log(param, !!param.level1);
  return {
    data: param.level1 ? level2[param.level1] : level1,
    code: 0,
  };
});
mock.get('/net-select/cascaderen', (param) => {
  const level1 = [
    { value: '10001', label: 'ShangHai' },
    { value: '10002', label: 'BeiJing' },
  ];
  return {
    data: level1,
    code: 0,
  };
});

mock.get('/remote/vali', ({ value = '' }) => {
  const flag = ['北京', '上海', '深圳'].some((item) => item === value);
  return {
    code: flag ? 0 : 1000,
    msg: flag ? void 0 : '不包含在北京、上海、深圳中',
  };
});
