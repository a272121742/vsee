import $ from '@http';

export default {
  // 分页
  getQuestionPage: param => $.get('/question/page', param),
  // 查看某个问题的详细信息
  eidtQuestion: id => $.get(`/issue/v1/issue/${  id}`),
  // 新加接口
  eidtQuestionAdd: id => $.get(`/issue/v1/issue/getSysDeptById?deptId=${  id}`),
  // 查看某个问题的附件
  getFilePage: () => ('/question/annex/page'),
  // 查看某个问题的操作记录
  getRecord: id => $.get('/issue/v1/workflow/operationHistory', { issue_id: id }),
  // oldTest
  getQuestionStep: () => $.get('/getAll/mock'),
  // 问题定义查询
  problemDefinition: id => $.get(`/issue/v1/workflow/problemDefinition?issue_id=${  id}`),
  // 问题定义保存
  problemDefinitionAdd: data => $.post('/issue/v1/workflow/problemDefinition', data),
  // 责任判定查询
  issueDefinition: id => $.get(`/issue/v1/workflow/issueDefinition?issue_id=${  id}`),
  // 责任判定保存
  issueDefinitionAdd: data => $.post('/issue/v1/workflow/issueDefinition', data),
  // 根本原因查询
  rootCause: id => $.get(`/issue/v1/workflow/rootCause?issue_id=${  id}`),
  // 根本原因保存
  rootCauseAdd: data => $.post('/issue/v1/workflow/rootCause', data),
  // 新增某个问题
  addQuestion: data => $.post('/activiti/running/completeTask', data),
  // 创建保存某个问题
  saveQuestion: data => $.post('/issue/v1/issue', data),
  getSysUser: data => $.get('/issue/v1/workflow/getSysUser', data),
  // getSysUser: (issueSource, type) => $.get('/issue/v1/workflow/getSysUser', { issueSource, type }),
  /**
   * 问题提交至工作流
   */
  workFlowSubmit: data => $.post('/activiti/running/completeTask', data),
  /**
   * 工作流中的审核
   */
  examineDetail: data => $.get('/issue/v1/workflow/comment/nodeComment', data),
  // 再分配
  redistributionFun: data => $.post('/activiti/running/reAssignTask', data),
  // 再分配修改后台用户
  updateChampionFun: data => $.put('/issue/v1/issue/setIssueAssigner', data),
  /**
   * 措施判定保存
   */
  MeasureDecisionSave: data => $.post('/issue/v1/workflow/actionDraft', data),
  // 措施判定详情查询
  MeasureDetail: issueId => $.get(`/issue/v1/workflow/actionDraft?type=0&issueId=${  issueId}`),
  // 措施实施详情查询
  ImplementationDetail: issueId => $.get(`/issue/v1/workflow/actionDraft?type=1&issueId=${  issueId}`),
  // 文件更新表格
  updateFile: issueId => $.get(`/issue/v1/workflow/fileUpdatesList?issueId=${  issueId}`),
  // 文件首次创建
  firstCreateFile: data => $.post('/issue/v1/workflow/fileUpdatesList', data),
  // 添加文件
  addFile: data => $.post('/issue/v1/workflow/fileUpdates', data),
  // 编辑文件
  editFile: data => $.put('/issue/v1/workflow/fileUpdates', data),
  // 效果验证保存
  effectSave: data => $.post('/issue/v1/workflow/validation', data),
  // 效果验证查询
  effectDetail: issueId => $.get(`/issue/v1/workflow/validation?issueId=${  issueId}`),
  // 保存七钻
  sevenDiamonds: data => $.get('/v1/workflow/sevenDiamonds', data),
  // 修改保存某个问题
  editSaveQuestion: data => $.put('/issue/v1/issue', data),
  // 再分配某个问题
  redistribute: data => $.post('/question/redis', data),
  // 7钻分析表格
  getAnalysis: id => $.get(`/analysisData/${  id}`),
  /**
   * 获取所有问题分页列表
   * @author loong.qian
   */
  getIssuePage: param => $.get('/issue/v1/issue/page', param),
  // 问题关闭保存
  closeSave: data => $.post('/issue/v1/workflow/issueClose', data),
  // 问题关闭查询
  closeDetail: issueId => $.get(`/issue/v1/workflow/issueClose?issueId=${  issueId}`),
  // 原因分析保存
  analysisSave: data => $.post('/issue/v1/workflow/rootCause', data),
  analysisDetail: issueId => $.get(`/issue/v1/workflow/rootCause?issue_id=${  issueId}`),
  // 获取页面权限
  getIssueAutomousRegion: id => $.get(`/issue/v1/workflow/getIssueAutomousRegion?issueId=${  id}`),
  getStatusCode: id => $.get(`/issue/v1/workflow/getStatusCode?issueId=${  id}`),
  // 保存7钻
  saveSevenDiamonds: data => $.post('/issue/v1/workflow/sevenDiamonds', data),
  // 数据导出
  exportData: param => $.get('/issue/v1/issue/export', param),
  // 删除问题
  delIssue: param => $.post('/issue/v1/issue/', param),
  // 获取模版下载
  getTemplateDownload: param => $.get('/issue/v1/file/template', param),
  issueImport: param => $.post('/issue/v1/issue/import', param),
  issueExportTemplate: param => $.get('/issue/v1/issue/exportTemplate', param, { responseType: 'blob' }),
  // 查看工作流角色任务信息
  getActIdMembership: param => $.get('/issue/v1/workflow/getActIdMembership', param),
  // 保存工作流角色对应用户关系
  addActIdMembership: data => $.post('/issue/v1/workflow/addActIdMembership', data),
  // 获取科长部长
  getUserByPositionCode: param => $.get('/sys/user/userInfo/getByPositionCode', param),
  // 获取工作流科长部长
  getUserByworkflowPositionCode: param => $.get('/sys/user/workflowuserInfo/getByPositionCode', param),
};
