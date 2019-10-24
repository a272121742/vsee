import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const datas = mock({
  id: '@id',
  name: 'IRSYYYY@string("number", 6)'
}, 10);

const db = cdb.link('order', datas);

mock.get('/order/list', () => {
  const dts = db.find();
  return mock.result({
    data: {
      list: dts,
      total: dts.length
    },
    code: 0
  });
}, { timeout: 0 });

mock.get('/order/:id', id => {
  const data = db.findById(Number(id));
  return mock.result({
    data,
    code: 0
  });
});

mock.post('/order/add/', (data) => {
  db.insert(data);
  const dts = db.find();
  console.log(dts);
});

mock.get('/order/del/:id', id => {
  db.remove(id);
  const dts = db.find();
  return mock.result({
    data: {
      list: dts,
      total: dts.length
    },
    code: 0
  });
}, { timeout: 0 });

mock.post('/order/edit', data => {
  db.update(data.id, data);
  const dts = db.find();
  console.log(dts);
  return mock.result({
    data: {
      list: dts,
      total: dts.length
    },
    code: 0
  });
}, { timeout: 0 });

// db.remove(id)
// const dts = db.find();
// return mock.result({
//   data: {
//     list: dts,
//     total: dts.length
//   },
//   code: 0
// });
// }, { timeout: 0 }
