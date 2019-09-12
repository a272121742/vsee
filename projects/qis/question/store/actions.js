import api from '../api.js';

export default {
  /**
   * 分页
   */
  getQuestionPage(store, param) {
    return api.getQuestionPage(param);
  },
  /**
   * 新增问题
   */
  addQuestion(store, data) {
    return api.addQuestion(data);
  },
  /**
   * 创建保存问题
   */
  saveQuestion(store, data) {
    return api.saveQuestion(data);
  },
  /**
  /**
 * 措施判定保存
 */
MeasureDecisionSave(store,data){
  return api.MeasureDecisionSave(data);
},

   /**
   * 问题提交至工作流
   */
  workFlowSubmit(store, data) {
    return api.workFlowSubmit(data);
  },

  /**
   * 修改保存问题
   */
  editSaveQuestion(store, data) {
    return api.editSaveQuestion(data);
  },

  /**
   *查看某个问题
   */
  eidtQuestion(store, id) {
    return api.eidtQuestion(id);
  },
  getAnalysis(store, id) {
    return api.getAnalysis(id);
  },
  /**
   * 再分配问题
   */
  redistribute(store, data) {
    return api.redistribute(data);
  },

  /**
   * 新增问题并保存
   */
  commitQuestion() {

  },
  /**
   * 修改问题
   */
  updateQuestion() {

  },
  // 查看某个问题的附件
  getFilePage() {
    return api.getFilePage();
  },
  // 查看某个问题的操作记录
  getRecord() {
    return api.getRecord();
  },
  // oldTest
  getQuestionStep(store, id) {
    return api.getQuestionStep(id);
  },
  // 问题定义查询
  problemDefinition(store, id) {
    return api.problemDefinition(id);
  },
  //问题定义保存
  problemDefinitionAdd(store, data) {
    return api.problemDefinitionAdd(data);
  },
  //责任判定
  issueDefinition(store, id) {
    return api.issueDefinition(id);
  },
  //责任判定保存
  issueDefinitionAdd(store, data) {
    return api.issueDefinitionAdd(data);
  },
  //根本原因查询
  rootCause(store, id) {
    return api.rootCause(id);
  },
  //根本原因保存
  rootCauseAdd(store, data) {
    return api.rootCauseAdd(data);
  },
  /**
   * 获取问题分页列表
   * @author loong.qian
   */
  getIssuePage(store, param) {
    return api.getIssuePage(param);
  }
};
