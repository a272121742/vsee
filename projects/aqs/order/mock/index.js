import mock from '@mock';
import cdb from '@lib/cdb.js';

const list = mock({
  // 4. string 北汽编号规则：IRSYYYY000000
  claimTypeL1Code: 'IRSYYYY@string("number", 6)', // 索赔类型
  claimTypeL2Code: '@string("number", 2)', // 索赔二级
  claimNo: '@string("number", 6)', // 索赔单号
  serviceStationName: '@name', // 服务站
  areaNameZh: '@region', // 地区  暂定
  vin: 'VIN@string("number", 4)', // VIN
  salesDate: '@date', // 保修起始日期
  factoryName: '@ctitle', // 下线工厂
  claimOrderStatus: '@color', // 单据状态
  vhclModelName: '@ctitle', // 车型名称
  prodDate: '@date', // 出厂日期
  desc: '@cparagraph',
}, 100);

const db = cdb.link('claimorder', list);

mock.get('/field-q/v1/claimorder/page', ({
  page = 1, limit = 10,
}) => {
  const search = {};
  const datas = db.find(search);
  const begin = limit * (page - 1);
  const end = begin + limit;
  return mock.result({
    data: {
      list: datas.slice(begin, end),
      total: datas.length,
    },
  });
});
mock.get('/masterdata/v1/part', () => ({
  data: [{
    id: 1,
    name: '678912',
    code: '111',
  }, {
    id: 2,
    name: 'xskjnsjnsj',
    code: '222',

  }],
  code: 0,
}));
