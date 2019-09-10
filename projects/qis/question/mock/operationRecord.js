import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  'recode|1': ['保存', '提交', '通过'],
  'progress|1': ['D0', 'D1', 'D2', 'D3'],
  user: '@string',
  operateTime: Date.now(),
  'remark|1': ['通过', '未通过']
}, 30);

const db = cdb.link('operationRecord', list);

/**
 * 分页查询
 * { page, limit, orderField, order, username}
 */
mock.get('/question/action/page', (parameter) => {
  const datas = db.find() || [];
  const pageNo = parameter.pageNo|| 1;;
  const pageSize = parameter.pageSize||10;
  const totalCount = datas.length;
  const totalPage = (totalCount % pageSize) + 1;
  const start = pageSize * (pageNo - 1);
  const end = start + pageSize;
  return mock.result({
    data: {
      list: datas.slice(start, end),
      total: totalCount
    }
  });
}, { timeout: 0 });
