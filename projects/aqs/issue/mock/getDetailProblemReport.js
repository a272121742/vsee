import mock from '@mock';
import cdb from '@lib/cdb.js';

const list = mock({
  asqIssueCategory: 1,
  asqIssueGrade: 1,
  asqIssueRptCode: 1,
  asqIssueRptId: 1,
  asqIssueRptType: 1,
  asqIssueSource: 1,
  batchId: 1,
  createDate: 1,
  creator: 1,
  delFlag: 1,
  deleteDate: 1,
  etlRemark: 1,
  falutDate: 1,
  faultCondition: 1,
  faultFeature: 1,
  faultFrequency: 1,
  faultSymptom: 1,
  faultTreeIds: 1,
  firstCausePart: 1,
  hisFaultStats: 1,
  isHandmade: 1,
  isRecur: 1,
  issueSource: 1,
  loadFrom: 1,
  optCounter: 1,
  originalAnalysis: 1,
  projectPhase: 1,
  refIssueCode: 1,
  smt: 1,
  supplierId: 1,
  tempSolution: 1,
  tenantCode: 1,
  updateDate: 1,
  updater: 1,
  vehicleModelId: 1,
  vhclSeriesCode: 1,
}, 1);

const db = cdb.link('DetailProblemReport', list);


mock.get('/field-q/v1/asqissuedefn/id', () => {
  const datas = db.find() || [];

  return mock.result({
    data: {
      list: datas,
      total: datas.length,
    },
  });
}, { timeout: 1 });
