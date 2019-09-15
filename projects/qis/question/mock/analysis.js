import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  id: '@increment',
  standard: '标准要求',
  actualSituation: '实际情况',
  conclusion: '结论',
  file: '2',
  'operation|1': ['编辑', '查看']
}, 3);

const db = cdb.link('analysis', list);


mock.get('/analysisData/:id', () => {
  const datas = db.find() || [];

  return mock.result({
    data: {
      list: datas

    }
  });
}, { timeout: 0 });
