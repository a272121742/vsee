import mock from '@lib/mock.js';
import cdb from '@lib/cdb.js';

const list = mock({
  asqIssueRptCode: 'RE001', // 报告编号
  asqIssueRptType: '@pick(["单车", "批量"])', // 报告类型
  isHandmade: '@ctitle', // 创建类型
  asqIssueSource: '@ctitle', // 问题来源
  createDate: '@date', // 发布日期
  asqIssueCategory: '@ctitle', // 问题类别
  vhclModelCode: '@ctitle', // 车型
  faultCondition: '@ctitle', // 问题描述
  IssueId: 'IRS2019011085', // Issue Id
  issueStatus: '状态', // Issue状态
}, 20);

const db = cdb.link('ProblemReport', list);


mock.get('/field-q/v1/asqissuedefn/page', ({
  page = 1, limit = 10,
}) => {
  const search = {};
  const datas = db.find(search);
  const begin = limit * (page - 1);
  const end = begin + limit;
  return mock.result({
    data: {
      list: datas.slice(begin, end),
      total: datas.length,
    },
  });
}, { timeout: 2000 });
