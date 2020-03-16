import mock from '@mock';
import cdb from '@lib/cdb.js';

const list = mock({
  // 4. string 北汽编号规则：IRSYYYY000000
  dealerCode: 'JS@string("number", 6)', // 库存地点代码
  custCode: 'JS@string("number", 6)', // 零售客户代码
  vhclStatus: 'JS@string("number", 6)', // 车辆状态
  vhclModelCode: 'HNY017@last', // 车型代码
  eleMotorCode: '@city', // 电机号
  brandCode: '@last', // 品牌代码
  brandName: '@word(7)', // 品牌名称
  inStockDate: '@date', // 入库日期
  materialCode: 'WP@string("number", 6)', // 物品代码
  materialName: '@word(7)', // 物品名称
}, 100);

const db = cdb.link('vehicle', list);

mock.get('/masterdata/v1/vehicle/page', ({
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

// 车型代码
mock.get('/masterdata/v1/vehicle/modelAndCode', (params) => ({
  data: [{
    id: 1,
    vhclModelCode: 'dd',
    vhclModelName: '大大',
  }, {
    id: 2,
    vhclModelCode: 'xx',
    vhclModelName: '小小',
  }, {
    id: 3,
    vhclModelCode: 'xm',
    vhclModelName: '小明',
  }, {
    id: 4,
    vhclModelCode: 'xh',
    vhclModelName: '小红',
  }],
  code: 0,
}), { timeout: 1000 });
// 车型名称
mock.get('/v1/vehicle/select', (params) => ({
  data: [{
    id: 1,
    name: '12345',
  }, {
    id: 2,
    name: 'NNKKMKMKM',
  }],
  code: 0,
}));
