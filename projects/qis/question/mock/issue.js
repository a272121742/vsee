import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  // 3. string 标定版本号
  calibrationVersion: 'CV@float(10, 11, 5, 5)',
  // 4. string 北汽编号规则：IRSYYYY000000
  code: 'IRSYYYY@string("number", 6)',
  // 5. string 配置字版本号
  confirmationVersion: 'PV@float(10, 11, 5, 5)',
  // 6. string 相关人手机
  contact: '@cparagraph(2)',
  // 7. string 创建时间
  createDate: '@datetime',
  // 8. integer 创建人id
  creator: '@pick([1, 2, 3])',
  // 9. string 问题创建部门名称
  creatorDept: '@pick(["A部门", "B部门", "C部门"])',
  // 10. string 创建人姓名
  creatorName: '@pick(["张三", "李四", "王五"])',
  // 11. integer 是否删除
  delFlag: '@pick([0, 1])',
  // 12. string 删除时间
  deleteDate: '@datetime',
  // 13. string 详细描述
  description: '@cparagraph',
  // 14. string 故障发生日期
  failureDate: '@datetime',
  // 15. string 故障代码id,规则:所属系统-id,所属功能-id,故障代码-id
  faultTreeIds: '@pick([1, 2, 3])',
  // 16. string 所属系统
  faultTreeIds1: '@pick(["系统1", "系统2", "系统3"])',
  // 17. string 所属功能
  faultTreeIds2: '@pick(["功能1", "功能2", "功能3"])',
  // 18. string 故障代码
  faultTreeIds3: '@pick(["故障代码1", "故障代码2", "故障代码3"])',
  // 19. integer 祸首件
  firstCausePart: '@integer(0, 100)',
  // 20. integer 问题频次
  frequency: '@integer(0, 100)',
  // 21. string 问题等级/严重等级（A-F）
  grade: '@pick(["A", "B", "C", "D", "E", "F"])',
  // 22. string 硬件版本号
  hardwareVersion: 'HV@float(10, 11, 5, 5)',
  // // 23. integer ID
  // id: '@id',
  // 24. integer 问题管理小组ID
  irtId: '@pick([1, 2, 3])',
  // 25. string 维修网点
  maintenanceStation: '维修网点@string("number", 1)',
  // 26. string 生产基地
  manufactureBase: '生产基地@string("number", 1)',
  // 27. integer 主问题ID
  masterIssueId: '@pick([1, 2, 3])',
  // 28. integer 故障里程
  milage: '@integer(0, 1000000000)',
  // 29. integer 操作次数（用于乐观锁）
  optCounter: '@integer(0, 10000)',
  // 30. integer 零件号
  partId: '@pick([1, 2, 3])',
  // 31. string 初步排查情况
  preliminaryInvestigation: '@cparagraph',
  // 32. string 生产时间
  productDate: '@datetime',
  // 33. string 问题阶段
  projectPhase: '@csentence',
  // 34. string 接收日期
  receiveDate: '@datetime',
  // 35. integer 重复关联问题
  relevanceIssuesId: '@pick([1, 2, 3])',
  // 36. string 备注
  remark: '@cparagraph',
  // 37. integer 责任部门
  responsibleDepartmentId: '@pick([1, 2, 3])',
  // 38. string 责任部门名称
  responsibleDepartmentName: '@pick(["责任部门1", "责任部门2", "责任部门3"])',
  // 39. string 软件版本号
  softwareVersion: 'SV@float(10, 11, 5, 5)',
  // 40. string 问题来源/问题分类
  source: '@csentence',
  // 41. string 状态
  status: '@pick(["草稿", "待办", "已办", "完成"])',
  // 42. integer 供应商ID
  supplierId: '@pick([1, 2, 3])',
  // 43. string 试验类型
  testType: '试验类型@string("number", 1)',
  // 44. string 标题：北汽新能源规则：车型-所属功能-故障名称
  title () {
    return [this.vehicleModelName, this.faultTreeIds2, this.faultTreeIds3].join('-')
  },
  // 45. string 修改时间
  updateDate: '@datetime',
  // 46. integer 修改人
  updater: '@pick([1, 2, 3])',
  // 47. integer 车型id
  vehicleModelId: '@pick([1, 2, 3])',
  // 48. string 车型名称
  vehicleModelName: '@pick(["车型1", "车型2", "车型3"])',
  // 49. string VIN号
  vinNo: 'VIN-@string("number", 2)',
  // 50. string 工况信息
  workConditionInfo: '@csentence'
}, 54);

const db = cdb.link('issue', list);

mock.get('/issue/v1/issue/page', ({
  order, orderField, page = 1, limit = 10, _t = Date.now(), ...query
}) => {
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

mock.get('/masterdata/v1/vehiclemodel', () => {
  return mock.result({
    data: [{
      id: 1,
      name: '车型1'
    }, {
      id: 2,
      name: '车型2'
    }]
  });
});
mock.get('/issue/v1/faultcategory', () => {
  return mock.result({
    data: []
  });
})
