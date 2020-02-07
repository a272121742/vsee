import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';


const db = cdb.link('col');

mock.get('/user/col/:key', (key) => mock.result({
  data: db.find({ key })[0],
}));

mock.put('/user/col/:key', (key, data) => {
  const dbData = db.find({ key })[0];
  if (dbData) {
    return mock.result({
      data: db.update(dbData.id, { key, ...data }),
    });
  }
  return mock.result({
    data: db.insert({ key, ...data }),
  });
});
