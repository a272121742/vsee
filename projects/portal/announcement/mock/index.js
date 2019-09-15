import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  // 3. string 内容
  content: '@cparagraph',
  // 4. string 创建时间
  createDate: '@datetime',
  // 5. integer 创建人
  creator: '@pick(1, 2, 3)',
  // 6. integer 是否删除
  delFlag: '@pick([0, 1])',
  // 7. string 删除时间
  deleteDate: '@datetime',
  // // 8. integer ID
  // id: '',
  // 9. integer 是否公开
  isPublic: '@pick([0, 1])',
  // 10. integer 是否发布
  isPublish: '@pick([0, 1])',
  // 11. integer 操作次数（用于乐观锁）
  optCounter: '@integer(0, 10000)',
  // 12. string 发布日期
  publish: '@datetime',
  // 13. integer 租客编号
  tenantCode: '@pick(1, 2, 3)',
  // 14. string 标题
  title: '@ctitle',
  // 15. string 修改时间
  updateDate: '@datetime',
  // 16. integer 修改人
  updater: '@pick([1, 2, 3])'
}, 34);


const db = cdb.link('announcement', list);

mock.get('/sys/announcement/page', ({ query = {}, page = 1, limit = 10 }) => {
  const datas = db.find(query);
  const begin = limit * (page - 1);
  const end = begin + limit;
  return mock.result({
    data: {
      list: datas.slice(begin, end),
      total: datas.length
    }
  });
});

mock.get('/sys/announcement/:id', (id) => {
  const data = db.findById(id);
  return mock.result({
    data
  });
});
