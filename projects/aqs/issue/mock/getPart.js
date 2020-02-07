import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  value: '@integer(1, 10)',
  label: '@ctitle',
}, 5);

const db = cdb.link('/masterdata/v1/part', list);


mock.get('/masterdata/v1/part', () => {
  const datas = db.find() || [];

  return mock.result({
    data: {
      list: datas,
      total: datas.length,

    },
  });
}, { timeout: 0 });
