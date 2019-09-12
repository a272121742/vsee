import $ from '@lib/ajax.js';

export default {
  // 分页
  getQuestionPage: (param) => $.get('/question/page',param),
  // 查看某个问题的详细信息
  eidtQuestion: (id) => $.get('/issue/v1/issue/' + id),
  // 查看某个问题的附件
  getFilePage: () => ('/question/annex/page'),
  // 查看某个问题的操作记录
  getRecord: () => $.get('/question/action/page'),
  getQuestionStep: (id) => $.get('/issue/v1/workflow/problemDefinition?issue_id=' + id ),
  //新增某个问题
  addQuestion: (data) => $.post('/activiti/running/completeTask', data),
  //创建保存某个问题
  saveQuestion:(data) => $.post('/issue/v1/issue', data),
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

  //修改保存某个问题
  editSaveQuestion:(data)=>$.put('/issue/v1/issue', data),
  // 再分配某个问题
  redistribute: (data) => $.post('/question/redis', data),
  //7钻分析表格
  getAnalysis:(id) => $.get('/analysisData/' + id),
  /**
   * 获取所有问题分页列表
   * @author loong.qian
   */
  getIssuePage: (param) => $.get('/issue/v1/issue/page', param),
};
