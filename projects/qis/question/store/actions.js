import api from '../api.js';

export default {
  /**
   * 分页
   */
  getQuestionPage (store,param) {
    return api.getQuestionPage(param);
  },
  /**
   * 新增问题
   */
  addQuestion (store, data) {
    return api.addQuestion(data);
  },
  /**
   * 创建保存问题
   */
  saveQuestion (store, data) {
    return api.saveQuestion(data);
  },
  /**
 * 措施判定保存
 */
MeasureDecisionSave(store,data){
  return api.MeasureDecisionSave(data);
},
//措施详情查询
MeasureDetail(store,issueId){
  return api.MeasureDetail(issueId);
},
   /**
   * 问题提交至工作流
   */
  workFlowSubmit (store, data) {
    return api.workFlowSubmit(data);
  },

  /**
   * 修改保存问题
   */
  editSaveQuestion (store, data) {
    return api.editSaveQuestion(data);
  },

  /**
   *查看某个问题
   */
  eidtQuestion (store, id) {
    return api.eidtQuestion(id);
  },
  getAnalysis(store, id){
    return api.getAnalysis(id);
  },
  /**
   * 再分配问题
   */
  redistribute (store, data) {
    return api.redistribute(data);
  },

  /**
   * 新增问题并保存
   */
  commitQuestion () {

  },
  /**
   * 修改问题
   */
  updateQuestion () {

  },
  // 查看某个问题的附件
  getFilePage () {
    return api.getFilePage();
  },
  // 查看某个问题的操作记录
  getRecord () {
    return api.getRecord();
  },
  // 查看某个问题的步骤详细信息
  getQuestionStep (store, id) {
    return api.getQuestionStep(id);
  },
  /**
   * 获取问题分页列表
   * @author loong.qian
   */
  getIssuePage (store, param) {
    return api.getIssuePage(param);
  }
};
