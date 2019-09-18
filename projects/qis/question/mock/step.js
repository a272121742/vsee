import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';


const d = mock({
  id: '1',
  // D0
  'isProject|1': ['0', '1'], //  是否满足立项条件
  dissatisfaction: '@string', // 不满理由
  Remarks: '不满足备注', // 备注
  'isNeedIca|1': ['0', '1'], // 是否需要围堵措施
  icaDescription: '', // 围堵措施
  // D1
  owerDeptLv1: '质量部', // 责任部门
  champion: '张三', // 责任人
  'type|1': ['0', '1'], // 判定
  fileList: ['1.jpg', '附件一.excel', '附件附件附件附件2.word', '2.jpg', '1.jpg', '附件一.excel', '附件附件附件附件2.word', '2.jpg'],
  zuanUser1: '张三',
  zuanUser4: '李四',
  zuanUser5: '王五',
  zuanUser6: '李六',
  zuanUser7: '王七',
  // D2
  rootCauseDescription: '根本原因根本原因根本原因根本原因根本原因根本原因根本原因',
  D2file: ['1.jpg', '附件一.excel', '附件附件附件附件2.word', '2.jpg'],
  // D3

  // icaDescription: '短期措施',  // 重复了
  pcaDescription: '长期措施',
  pcaPlanTime: '2019-01-01 00:00:00',
  pcaExecTime: '2019-01-01 00:00:00',
  estimatedClosureTime: '2019-01-01 00:00:00',
  smallBatchValidation: '小批量验证',

  // D4
  icaExecDescription: 'D4短期效果',
  icaExecTime: '短期措施实施时间',
  // pcaDescription: 'D4长期措施实施', // 重复了
  // pcaExecTime: 'D4长期措施实施时间', // 重复了

  // D5
  description: '效果验证',
  breakpointVin: '断点VIN',
  breakpointDate: '2019-9-30 00:00:00',
  updateList: [{
    // 文件名称
    id: '1',
    fileName: 'ECN',
    isUpdae: '0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }, {
    // 文件名称
    id: '2',
    fileName: 'DFMEA',
    isUpdae: '1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }, {
    // 文件名称
    id: '3',
    fileName: 'DV/PV 计划',
    isUpdae: '0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }, {
    // 文件名称
    id: '4',
    fileName: 'PFMEA',
    isUpdae: '0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }, {
    id: '5',
    // 文件名称
    fileName: '控制计划',
    isUpdae: '1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }, {
    id: '6',
    // 文件名称
    fileName: '过程流程图',
    isUpdae: '1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }, {
    id: '7',
    // 文件名称
    fileName: '操作指导书',
    isUpdae: '0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }, {
    id: '8',
    // 文件名称
    fileName: '新的操作指导书',
    isUpdae: '1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png']
  }],
  // D6
  'recurrencePrevention|1': ['是', '否'],
  'isClose |1': ['同意关闭', '不同意关闭'],
  reason: '何莎不同意关闭'
});

const db = cdb.link('step', d);

mock.get('/getAll/mock', (id) => {
  return mock.result({
    data: db.findById(id)
  });
}, {
  timeout: 0
});

/**
 *
 */
mock.get('/issue/v1/workflow/problemDefinition?issue_id=', (id) => {
  return mock.result({
    data: db.findById(id)
  });
}, {
  timeout: 0
});
// 措施判定保存
mock.post('/issue/v1/workflow/actionDraft', (data) => {
  return mock.result({
    data: db.insert(data)
  });
});
// 措施判定详情
mock.get('/issue/v1/workflow/actionDraft?type=0&issueId=', (issueId) => {
  return mock.result({
    data: db.findById(issueId)
  });
}, {
  timeout: 0
});
// 措施实施详情
mock.get('/issue/v1/workflow/actionDraft?type=1&issueId=', (issueId) => {
  return mock.result({
    data: db.findById(issueId)
  });
}, {
  timeout: 0
});
// 文件更新
mock.get('/issue/v1/workflow/fileUpdatesList?issueId=', (issueId) => {
  return mock.result({
    data: db.findById(issueId)
  });
}, {
  timeout: 0
});

// 文件首次创建
mock.post('/issue/v1/workflow/fileUpdatesList', (data) => {
  return mock.result({
    data: db.insert(data)
  });
});
// 文件添加
mock.post('/issue/v1/workflow/fileUpdates', (data) => {
  return mock.result({
    data: db.insert(data)
  });
});

// 文件编辑
mock.put('/issue/v1/workflow/fileUpdates', (data) => {
  return mock.result({
    data: db.insert(data)
  });
});
mock.get('/issue/v1/workflow/issueDefinition?issue_id=', (id) => {
  return mock.result({
    data: db.findById(id)

  });
}, {
  timeout: 0
});
// 效果验证保存
mock.post('/issue/v1/workflow/validation', (data) => {
  return mock.result({
    data: db.insert(data)
  });
});

// 效果验证详情
mock.get('/issue/v1/workflow/validation?issueId=', (issueId) => {
  return mock.result({
    data: db.findById(issueId)
  });
}, {
  timeout: 0
});

// 问题关闭保存
mock.post('/issue/v1/workflow/issueClose', (data) => {
  return mock.result({
    data: db.insert(data)
  });
});

// 问题关闭查询
mock.get('/issue/v1/workflow/issueClose?issueId=', (issueId) => {
  return mock.result({
    data: db.findById(issueId)
  });
}, {
  timeout: 0
});
// 原因分析保存
mock.post('/issue/v1/workflow/rootCause', (data) => {
  return mock.result({
    data: db.insert(data)
  });
});
// 原因分析查询
mock.get('/issue/v1/workflow/rootCause?issue_id=', (id) => {
  return mock.result({
    data: db.findById(id)
  });
});
// 用户信息
mock.get('/issue/v1/workflow/getSysUser', (data) => {
  debugger;
  return mock.result({
    data: db.find(data)
  });
});
