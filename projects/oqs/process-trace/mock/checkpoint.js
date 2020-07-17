import mock from '@mock';
import cdb from '@lib/cdb.js';

const list = mock({
  id: '@id',
  vin: 'LXXABCD@string("number", 6)', //
  model: 'model@string("number", 2)', //
  plant: '@string("upper", 2)', //
  orderNo: 'orNo@string("number", 2)', //
  bodyNo: 'bdNo@string("number", 4)', //
  paintNo: 'pNo@string("number", 2)', //
  gaNo: 'gaNo@string("number", 2)', //
  checkpointNo: 'gaNo@string("number", 2)',
  checkpointName: 'gaNo@string("number", 2)',
  checkpointType: 'gaNo@string("number", 2)',
  passTime: 'gaNo@string("number", 2)',
  status: 'gaNo@string("number", 2)',
  forced: 'gaNo@string("number", 2)',
  workShop: 'gaNo@string("number", 2)',
  line: 'gaNo@string("number", 2)',
  shift: 'gaNo@string("number", 2)',
}, 100);

const db = cdb.link('checkpoint', list);

mock.get('checkpoint/list', ({
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
