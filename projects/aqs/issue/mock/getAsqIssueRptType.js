import mock from '@mock';
import cdb from '@lib/cdb.js';

const list = mock({
  value: '@integer(1, 10)',
  label: '@ctitle',
}, 5);

const db = cdb.link('AsqIssueRptType', list);


mock.get('/sys/dict', ({ dictType }) => {
  const datas = db.find() || [];

  return mock.result({
    data: {
      list: datas,

    },
  });
}, { timeout: 0 });
