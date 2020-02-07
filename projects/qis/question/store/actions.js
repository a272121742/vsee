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
   * 问题提交至工作流（新版）
   */
  workFlowSubmitNew (store, data) {
    return api.workFlowSubmitNew(data);
  },
  /**
   * 自由跳转
   */
  moveto (store, data) {
    return api.moveto(data);
  },
  /**
   * 工作流中的审核
   */
  examineDetail (store, data) {
    return api.examineDetail(data);
  },
  // 再分配责任人
  redistributionFun (store, data) {
    return api.redistributionFun(data);
  },
  // 修改后台当前责任人
  updateChampionFun (store, data) {
    return api.updateChampionFun(data);
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
  eidtQuestionAdd (store, id) {
    return api.eidtQuestionAdd(id);
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
  getRecord (store, id) {
    return api.getRecord(id);
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
  getSysUser (store, data) {
    return api.getSysUser(data);
  },
  // 存七钻
  sevenDiamonds (store, data) {
    return api.sevenDiamonds(data);
  },
  /**
   * 获取问题分页列表
   * @author loong.qian
   */
  getIssuePage (store, param) {
    return api.getIssuePage(param);
  },
  /**
   * 获取待办问题清单
   * @author loong.qian
   */
  getIssueTodoPage (store, param) {
    return store.dispatch('getIssuePage', { ...param, type: 1 });
  },
  /**
   * 获取待发问题清单
   * @author loong.qian
   */
  getIssueDraftPage (store, param) {
    return store.dispatch('getIssuePage', { ...param, type: 0 });
  },
  /**
   * 获取已办问题清单
   * @author loong.qian
   */
  getIssueDonePage (store, param) {
    return store.dispatch('getIssuePage', { ...param, type: 2 });
  },
  /**
   * 获取已发问题清单
   * @author loong.qian
   */
  getIssuePublishedPage (store, param) {
    return store.dispatch('getIssuePage', { ...param, type: 3 });
  },
  /**
   * 获取暂存问题清单
   * @author Mary.he
   */
  getIssueTemporaryPage (store, param) {
    return store.dispatch('getIssuePage', { ...param, type: 4 });
  },
  // 原因分析保存
  // 问题定义保存
  analysisSave (store, data) {
    return api.analysisSave(data);
  },
  // 原因分析详情
  analysisDetail (store, id) {
    return api.analysisDetail(id);
  },
  // 获取页面权限
  getIssueAutomousRegion (store, id) {
    return api.getIssueAutomousRegion(id);
  },
  // 获取流程进度
  getStatusCode (store, id) {
    return api.getStatusCode(id);
  },
  // 保存7钻
  saveSevenDiamonds (store, data) {
    return api.saveSevenDiamonds(data);
  },
  //  数据导出
  exportData (store, param) {
    return api.exportData(param);
  },
  /**
   *查看某个问题
   */
  delIssue (store, param) {
    return api.delIssue(param);
  },
  /**
   * 模版下载
   * @param {*} store
   * @param {*} param
   */
  getTemplateDownload (store, param) {
    return api.getTemplateDownload(param);
  },
  issueImport (store, param) {
    return api.issueImport(param);
  },
  /**
   * 下载单页报告
   */
  issueExportTemplate (store, param) {
    return api.issueExportTemplate(param);
  },
  /**
   * 查看工作流角色任务信息
   */
  getActIdMembership (store, param) {
    return api.getActIdMembership(param);
  },
  /**
   * 保存工作流角色对应用户关系
   */
  addActIdMembership (store, data) {
    return api.addActIdMembership(data);
  },
  /**
   * 保存工作流角色对应用户关系到act
   */
  addActIdMembershipToAct (store, data) {
    return api.addActIdMembershipToAct(data);
  },
  /**
   * 获取对应人科长或者部长信息
   * @param {*} store
   * @param {*} data
   */
  getUserByPositionCode (store, data) {
    return api.getUserByPositionCode(data);
  },
  /**
   * 获取工作流对应人科长或者部长信息
   * @param {*} store
   * @param {*} data
   */
  getUserByworkflowPositionCode (store, data) {
    return api.getUserByworkflowPositionCode(data);
  },
  // 暂存
  temporarySave (store, data) {
    return api.temporarySave(data);
  },
  // 问题回退详情
  rollbackDetail (store, data) {
    return api.rollbackDetail(data);
  },
  // 回退或关闭
  backOrClose (store, data) {
    return api.backOrClose(data);
  },
  // 特殊关闭工作流
  speCloseWorkFlow (store, data) {
    return api.speCloseWorkFlow(data);
  },
  // 获取关联问题详情
  getAssociated (store, issueId) {
    return api.getAssociated(issueId);
  },
  // 重复问题保存
  duplicateSave (store, data) {
    return api.duplicateSave(data);
  },
  // 被关联问题详情
  relatedDetail (store, issueId) {
    return api.relatedDetail(issueId);
  },
  // 重复关联表格
  associatedTable (store, data) {
    return api.associatedTable(data);
  },
  // 查询问题裂变信息
  fissionDetail (store, issueId) {
    return api.fissionDetail(issueId);
  },
  // 问题裂变保存
  fissionSave (store, data) {
    return api.fissionSave(data);
  },
  // 问题裂变删除
  fissionDelete (store, param) {
    return api.fissionDelete(param);
  },
  // 问题裂变修改
  fissionEdit (store, data) {
    return api.fissionEdit(data);
  },
  // 主问题问题裂变修改
  issueIsPission (store, data) {
    return api.issueIsPission(data);
  },
  // 子问题保存
  childSave (store, data) {
    return api.childSave(data);
  },
  // 处理主问题状态跳转
  handleMainIssue (store, masterIssueId) {
    return api.handleMainIssue(masterIssueId);
  },
  replaceSMSave (store, data) {
    return api.replaceSMSave(data);
  },
};
