/**
 * lokijs为同步写法的数据，但浏览器刷新后无法实现数据永久缓存
 * 如果希望数据可以缓存，选用rxdb、nedb、minimongo、pouchdb，这几种数据库内置indexDB和localstorage的接口，但暂未尝试是否能永久存储，如果想找寻更多，可以查看这个网页 https://www.javascripting.com/search?q=database
 * rxdb - https://pubkey.github.io/rxdb/
 * nedb - https://github.com/louischatriot/nedb
 * minimongo - https://github.com/mWater/minimongo
 * pouchdb - https://github.com/pouchdb/pouchdb
 * lokidb - https://github.com/techfort/LokiJS/wiki
 */
import Loki from 'lokijs';
import { clone } from 'ramda';


// const indexedAdapter = new Loki.LokiPartitioningAdapter(new Loki.LokiIndexedAdapter(),  { paging: true });

const db = new Loki('browser_testing.db', {
  env: 'BROWSER',
  autoload: true,
  autosave: true,
  adapter: new Loki.LokiMemoryAdapter(),
  // adapter: new Loki.LokiLocalStorageAdapter(),
  // adapter: indexedAdapter
  // adapter: new Loki.LokiIndexedAdapter('app'),
});

/**
 * 转换数据库查询文档的格式；
 * 因为`lokijs`中会存储`$loki`和`meta`信息，这两个有别于SQL型数据库，为了和SQL数据库保持一致，作此处理；
 * 并且这两个属性不能删除，否则数据无法进行CRUD操作，本函数只对取出对数据做转换，不会重新入库。
 * @param {*} doc
 */
function transform (dbDoc) {
  const doc = clone(dbDoc);
  if (Object.prototype.hasOwnProperty.call(doc, '$loki')) {
    doc.id = doc.$loki;
    delete doc.$loki;
  }
  if (Object.prototype.hasOwnProperty.call(doc, 'meta')) {
    delete doc.meta;
  }
  return doc;
}
/**
 * CDB采用NoSQL类型，可以随意存取
 * 链接到name表，如果存在则直接连接，反之创建
 * @param {*} name 表名
 */
function link (name, baseData) {
  if (!name) {
    throw new Error('table name must be required');
  }
  const collectionNames = db.listCollections() || [];
  if (!~collectionNames.findIndex((collection) => collection.name === name)) {
    db.addCollection(name);
  }
  const table = db.getCollection(name);
  if (baseData && Array.isArray(baseData) && baseData.length >= 0) {
    table.insert(baseData);
  } else if (baseData && !Array.isArray(baseData)) {
    table.insert([baseData]);
  }
  const apis = {
    /**
     * 新增操作(可批量操作)
     * @success 返回插入成功后的数据
     * @fail 返回`undefined`
     * @param {*} docs
     */
    insert (docs) {
      if (!docs || docs.length === 0) {
        return void (0);
      }
      if (Array.isArray(docs) && docs.length > 1) {
        return table.insert(docs).map(transform);
      }
      const doc = table.insert(docs.length === 1 ? docs[0] : docs);
      return transform(doc);
    },
    /**
     * 删除操作
     * @success 删除成功后的数据（原数据）
     * @fail 返回`undefined`
     * @param {*} id / query - 数据id
     */
    remove (query) {
      if (typeof query === 'object') {
        const docs = table.find(query);
        if (docs.length) {
          const cacheDocs = docs.map(transform);
          table.remove(docs);
          return cacheDocs;
        }
        return void (0);
      }
      const id = query;
      const doc = table.get(Number(id));
      if (doc) {
        const cacheDoc = transform(doc);
        table.remove(doc);
        return cacheDoc;
      }
      return void (0);
    },
    /**
     * 更新操作
     * @param {*} id - 数据id
     * @param {*} newdoc - 更新后的文档
     * @param {Boolean} - replaced 是否全部替换（默认局部替换）
     */
    update (id, newdoc, replaced = false) {
      const doc = table.get(Number(id));
      if (doc) {
        if (replaced) {
          const dbDoc = table.update({ $loki: id, ...newdoc, meta: doc.meta });
          return transform(dbDoc);
        }
        // 默认更新局部信息
        return transform(table.update({ ...doc, ...newdoc }));
      }
      return void (0);
    },
    /**
     * 查询数据
     * @param {*} id
     */
    findById (id) {
      const doc = table.get(Number(id));
      return doc ? transform(doc) : void (0);
    },
    /**
     * 查询数据
     * @param {*} query
     */
    find (query = {}) {
      const docs = table.find(query);
      return docs.map(transform);
    },
  };
  return apis;
}

export default {
  link,
};
