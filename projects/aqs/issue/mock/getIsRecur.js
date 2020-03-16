import mock from '@mock';
import cdb from '@lib/cdb.js';

const list = mock({
  value: '@integer(1, 10)',
  label: '@ctitle',
}, 2);

const db = cdb.link('/sys/dict?dictType=is_recur', list);


mock.get('/sys/dict?dictType=is_recur', () => {
  const datas = db.find() || [];

  return mock.result({
    data: {
      list: datas,
      total: datas.length,

    },
  });
}, { timeout: 0 });
