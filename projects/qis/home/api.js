import $ from '@http';

export default {
  creatorCount: (params) => $.get('/issue/v1/issue/get/creatorCount', params),
  championCount: (params) => $.get('/issue/v1/issue/get/championCount', params),
  getIssueOverDaysList: (params) => $.get('/issue/v1/issue/get/issueOverDays', params),
};
