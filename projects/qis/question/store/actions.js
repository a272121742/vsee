import api from '../api.js';

export default {
  /**
   * 分页
   */
  getQuestionPage (store, param) {
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
  /**
 * 措施判定保存
 */
  MeasureDecisionSave (store, data) {
    return api.MeasureDecisionSave(data);
  },
  // 措施判定详情查询
  MeasureDetail (store, issueId) {
    return api.MeasureDetail(issueId);
  },
  // 措施实施详情查询
  ImplementationDetail (store, issueId) {
    return api.ImplementationDetail(issueId);
  },
  // 文件更新表格
  updateFile (store, issueId) {
    return api.updateFile(issueId);
  },
  // 文件首次创建
  firstCreateFile (store, data) {
    return api.firstCreateFile(data);
  },
  // 添加文件
  addFile (store, data) {
    return api.addFile(data);
  },
  editFile (store, data) {
    return api.editFile(data);
  },
  // 效果验证保存
  effectSave (store, data) {
    return api.effectSave(data);
  },
  // 效果验证查询
  effectDetail (store, issueId) {
    return api.effectDetail(issueId);
  },
  // 问题关闭保存
  closeSave (store, data) {
    return api.closeSave(data);
  },
  // 问题关闭详情
  closeDetail (store, issueId) {
    return api.closeDetail(issueId);
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
  getAnalysis (store, id) {
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
  // oldTest
  getQuestionStep (store, id) {
    return api.getQuestionStep(id);
  },
  // 问题定义查询
  problemDefinition (store, id) {
    return api.problemDefinition(id);
  },
  // 问题定义保存
  problemDefinitionAdd (store, data) {
    return api.problemDefinitionAdd(data);
  },
  // 责任判定
  issueDefinition (store, id) {
    return api.issueDefinition(id);
  },
  // 责任判定保存
  issueDefinitionAdd (store, data) {
    return api.issueDefinitionAdd(data);
  },
  // 根本原因查询
  rootCause (store, id) {
    return api.rootCause(id);
  },
  // 根本原因保存
  rootCauseAdd (store, data) {
    return api.rootCauseAdd(data);
  },
  // 获取系统用户
  getSysUser (store, issueSource, type) {
    return api.getSysUser(issueSource, type);
  },
  // 存七钻
  sevenDiamonds (store, data) {
    return api.getSysUser(data);
  },
  /**
   * 获取问题分页列表
   * @author loong.qian
   */
  getIssuePage (store, param) {
    return api.getIssuePage(param);
  },
  // 原因分析保存
  // 问题定义保存
  analysisSave (store, data) {
    return api.analysisSave(data);
  },
  // 原因分析详情
  analysisDetail (store, id) {
    return api.analysisDetail(id);
  }
};
