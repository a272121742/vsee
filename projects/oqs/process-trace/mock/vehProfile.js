import mock from '@mock';
import cdb from '@lib/cdb.js';

const list = mock({
  id: '@id',
  vin: 'LXXABCD@string("number", 6)', // 索赔类型
  model: 'model@string("number", 2)', // 索赔二级
  plant: '@string("upper", 2)', // 索赔单号
  orderNo: 'orNo@string("number", 2)', // 服务站
  bodyNo: 'bdNo@string("number", 4)', // 地区  暂定
  paintNo: 'pNo@string("number", 2)', // 保修起始日期
  gaNo: 'gaNo@string("number", 2)', // 下线工厂
  gaBuyoffTime: '@datetime',
  handoverTime: '@datetime',
  modelCode: 'code@string("number", 2)',
  color: '@color',
  materialCode: 'mm@string("number", 6)',
}, 100);

const db = cdb.link('vehProfile', list);

mock.get('vehProfile/list', ({
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
