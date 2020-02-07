import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  id: '@increment',
  no: '@id',
  title: '@title',
  code: '@string',
  createDate: '2019-08-29 00:00:00', // 立项日期
  'source|1': ['BIR', 'TIR'],
  faultTreeIds1: 'D0', // 所属系统
  faultTreeIds2: 'D0', // 所属功能
  faultTreeIds3: 'D0', // 故障代码
  grade: 'D0', // 严重等级
  source: 'D0', // 问题分类
  vehicleModelId: 'D0', // 车型
  vehicleModelName: '1111',
  projectPhase: 'D0', // 问题阶段
  acceptDate: '2019-10-1', // 接收日期
  'progress|1': ['未进行', '进行中', '已完成'], // 解决进度
  manufactureBase: 'D0', // 生产基地
  failureDate: undefined, // 故障发生日期
  'questionOrigin|1': ['D0', 'D1', 'D2', 'D3'], // 问题来源
  'frequency|1': ['D0', 'D1', 'D2', 'D3'], // 问题频次
  'responsibleDepartmentId|1': ['D0', 'D1', 'D2', 'D3'], // 责任部门
  description: 'AP11', // 问题描述
  file: '3.png', // 文件上传
  contact: '17621731424', // 问题相关人员联系方式
  testType: '试验类型', // 试验类型
  'firstCausePart|1': ['D0', 'D1', 'D2', 'D3'], // 祸首件
  'partId|1': ['D0', 'D1', 'D2', 'D3'], // 零件号
  'supplierId|1': ['D0', 'D1', 'D2', 'D3'], // 供应商名称
  softwareVersion: 'softA1', // 软件版本号
  calibrationVersion: 'calibrationVersion ', // 标定版本号
  hardwareVersion: 'hardwareVersion ', // 硬件版本号
  confirmationVersion: 'confirmationVersion ', // 配置字版本号
  vinNo: 'vinNo ', // Vin
  productDate: undefined, // 生产时间
  maintenanceStation: '网点1', // 维修网点
  'schedule|1': ['D0', 'D1', 'D2', 'D3'],
  'status|1': [0, 1], // 0 - 关闭； 1 - 运行中； 2 - 已经上线?
  createTime: undefined, // 创建时间
  milage: '2', // 故障里程
  remark: '补充备注',
  Personliable: '小明',
  createDepart: '创建部门',
  creatorName: '创建人',
  // createDate: '2019-08-20', // 重复了
  workConditionInfo: '工况信息',
  preliminaryInvestigation: '初步排查情况',
}, 30);

const db = cdb.link('question', list);

/**
 * 分页查询
 * { page, limit, orderField, order, username}
 */

mock.get('/question/page', (parameter) => {
  const datas = db.find() || [];
  const pageNo = parameter.pageNo || 1;
  const pageSize = parameter.pageSize || 10;
  const totalCount = datas.length;

  const start = pageSize * (pageNo - 1);
  const end = start + pageSize;
  return mock.result({
    data: {
      list: datas.slice(start, end),
      total: totalCount,
    },
  });
}, { timeout: 0 });
/**
 * 编辑问题
 */
mock.get('/issue/v1/issue/:id', (id) => mock.result({
  data: db.findById(id),
}), { timeout: 0 });
// /**
//  * 获取单个
//  */
// mock.get('/api/xxxx/:id');
/**
 * 新增
 */
mock.post('/activiti/running/completeTask', (data) => mock.result({
  data: db.insert(data),
}));
/**
 * 问题创建保存至草稿
 */
mock.post('/issue/v1/issue', (data) => mock.result({
  data: db.insert(data),
}));
/**
 * 问题提交至工作流
 */
mock.post('/activiti/running/completeTask', (data) => mock.result({
  data: db.insert(data),
}));
/**
 * 问题修改保存至草稿
 */
mock.put('/issue/v1/issue', (data) => mock.result({
  data: db.insert(data),
}));

/**
 * 再分配问题
 */
mock.post('/question/redis', (data) => mock.result({
  data: db.insert(data),
}));
// /**
//  * 修改
//  */
// mock.put('/api/xxxx');
// /**
//  * 删除
//  */
// mock.delete('/api/xxxx');

// /**
//  * 查询列表
//  */
// mock.get('/api/xxxx/list');
// /**
//  * 查询树状列表
//  */
// mock.get('/api/xxxx/tree');
