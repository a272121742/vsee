import $ from '@lib/ajax.js';

export default {
  // 分页
  getQuestionPage: (param) => $.get('/question/page', param),
  // 查看某个问题的详细信息
  eidtQuestion: (id) => $.get('/issue/v1/issue/' + id),
  // 查看某个问题的附件
  getFilePage: () => ('/question/annex/page'),
  // 查看某个问题的操作记录
  getRecord: () => $.get('/question/action/page'),
  //oldTest
  getQuestionStep: () => $.get('/getAll/mock'),
  //问题定义查询
  problemDefinition: (id) => $.get('/issue/v1/workflow/problemDefinition?issue_id=' + id),
  //问题定义保存
  problemDefinitionAdd: (data) => $.post('/issue/v1/workflow/problemDefinition', data),
  //责任判定查询
  issueDefinition: (id) => $.get('/issue/v1/workflow/issueDefinition?issue_id=' + id),
  //责任判定保存
  issueDefinitionAdd: (data) => $.post('/issue/v1/workflow/issueDefinition', data),
  //根本原因查询
  rootCause: (id) => $.get('/issue/v1/workflow/rootCause?issue_id=', id),
  //根本原因保存
  rootCauseAdd: (data) => $.post('/issue/v1/workflow/rootCause', data),
  //新增某个问题
  addQuestion: (data) => $.post('/activiti/running/completeTask', data),
  //创建保存某个问题
  saveQuestion: (data) => $.post('/issue/v1/issue', data),
  getSysUser: (issueSource,type)=>$.get('/issue/v1/workflow/getSysUser',{issueSource, type}),
  /**
 * 问题提交至工作流
 */
workFlowSubmit:(data)=> $.post('/activiti/running/completeTask', data),
 /**
 * 措施判定保存
 */
MeasureDecisionSave: (data) => $.post('/issue/v1/workflow/actionDraft', data),
//措施判定详情查询
MeasureDetail:(issueId)=>$.get('/issue/v1/workflow/actionDraft?type=0&issueId='+issueId),
//措施实施详情查询
  //保存七钻
  sevenDiamonds:(data)=>$.get('/v1/workflow/sevenDiamonds',data),
  //修改保存某个问题
  editSaveQuestion: (data) => $.put('/issue/v1/issue', data),
  // 再分配某个问题
  redistribute: (data) => $.post('/question/redis', data),
  //7钻分析表格
  getAnalysis: (id) => $.get('/analysisData/' + id),
  /**
   * 获取所有问题分页列表
   * @author loong.qian
   */
  getIssuePage: (param) => $.get('/issue/v1/issue/page', param),
};
