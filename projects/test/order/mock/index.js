import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';


const list = mock({
  'no': '@id',
  'title': '@name',
}, 100);

const db = cdb.link('order', list);

mock.get('/order/list', args => {
  const result = db.find();
  return mock.result({
    data: {
      data: result.slice(4, 40),
      total: result.length
    },
  });
});

mock.post('/order', data => {
  return mock.result({
    data: {
      data: db.insert(data)
    }
  });
});


/**
 * cdb具备前端数据库的通用API
 * 1. 查询 db.find 查询所有，
 * 2. db.findById
 * 3. db.update(id, newdata, replace)
 * 4. db.insert(data)
 * 5. db.delete()
 */


// 原数据 （存在数据库的）{
//    a: 1,
//    b: 2,
//    c: 3,
//  }

//  新数据（从前端获得） {
//    a: 2
//  }
//  1. {a:2, b:2, c:3}
//  2. {a:2}