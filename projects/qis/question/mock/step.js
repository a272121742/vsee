import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';
import moment from 'moment'

const d = mock({
  id: '1',
  // D0
  'isProject|1': ['0', '1'], //  是否满足立项条件
  dissatisfaction: '@string', // 不满理由
  Remarks: '不满足备注', // 备注
  Remarks: '', // 备注
  'isNeedIca|1': ['0', '1'], //是否需要围堵措施
  icaDescription: '', //围堵措施
  // D1
  D1department: '质量部', //责任部门
  D1user: '张三', //责任人
  "determine|1": ['0','1'], //判定
  fileList: ['1.jpg', '附件一.excel', '附件附件附件附件2.word', '2.jpg', '1.jpg', '附件一.excel', '附件附件附件附件2.word', '2.jpg'],
  firstUser: '张三',
  fourthUser: '李四',
  FifthUser: '王五',
  sixthUser: '李六',
  seventhUser: '王七',
  //D2
  rootCauseDescription: '根本原因根本原因根本原因根本原因根本原因根本原因根本原因',
  D2file: ['1.jpg', '附件一.excel', '附件附件附件附件2.word', '2.jpg'],
  // D3

  icaDescription: '短期措施',
  pcaDescription : '长期措施',
  pcaPlanTime: '2019-01-01 00:00:00',
  pcaExecTime: '2019-01-01 00:00:00',
  estimatedClosureTime: '2019-01-01 00:00:00',
  fileList: ['D3file.png', 'D3file.word'],
  smallBatchValidation: '小批量验证',

  // D4
  icaExecDescription: 'D4短期效果',
  icaExecTime : '短期措施实施时间',
  pcaDescription  : 'D4长期措施实施',
  pcaExecTime : 'D4长期措施实施时间',
  fileList: ['D4.png', 'D3file.word'],

  // D5
  description: '效果验证',
  breakpointVin : '断点VIN',
  breakpointDate : '2019-9-30 00:00:00',
  "updateList": [{
    //文件名称
    id:'1',
    fileName:'ECN',
    isUpdate:'0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }, {
    //文件名称
    id:'2',
    fileName:'DFMEA',
    isUpdate: '1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }, {
    //文件名称
    id:'3',
    fileName:'DV/PV 计划',
    isUpdate: '0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }, {
    //文件名称
    id:'4',
    fileName:'PFMEA',
    isUpdate: '0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }, {
    id:'5',
    //文件名称
    fileName:'控制计划',
    isUpdate:'1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }, {
    id:'6',
    //文件名称
    fileName:'过程流程图',
    isUpdate: '1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }, {
    id:'7',
    //文件名称
    fileName:'操作指导书',
    isUpdate: '0',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }, {
    id:'8',
    //文件名称
    fileName:'新的操作指导书',
    isUpdate: '1',
    updateContent: '更新内容',
    updateoperation: '编辑',
    updatefile: ['d5.word', 'd5.png'],
  }],
  // D6
  'recurrencePrevention|1': ['是', '否'],
  'isClose |1': ['同意关闭', '不同意关闭'],
  reason : '何莎不同意关闭'
});

const db = cdb.link('step', d);


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