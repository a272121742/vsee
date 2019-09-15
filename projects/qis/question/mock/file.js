import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  id: '@increment',
  no: '@id',
  name: '@title',
  uploadTime: Date.now(),
  uploadUser: '@string',
  operation: '下载' // 故障代码
}, 30);

const db = cdb.link('file', list);

/**
 * 分页查询
 * { page, limit, orderField, order, username}
 */
mock.get('/question/annex/page', (parameter) => {
  const datas = db.find() || [];
  const pageNo = parameter.pageNo;
  const pageSize = parameter.pageSize;
  const totalCount = datas.length;
  const start = pageSize * (pageNo - 1);
  const end = start + pageSize;
  return mock.result({
    data: {
      list: datas.slice(start, end),
      total: totalCount
    }
  });
}, { timeout: 0 });
