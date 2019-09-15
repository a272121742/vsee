import moment from 'moment';

// 问题列配置
export const issue_columns = [{
  // 问题编号
  title: 'code',
  dataIndex: 'code',
  width: 136,
  scopedSlots: { customRender: 'code' }
}, {
  // 标题
  title: 'title',
  dataIndex: 'title',
  width: 200,
  scopedSlots: { customRender: 'title' }
}, {
  // 所属系统
  title: 'faultTreeIds1',
  dataIndex: 'faultTreeIds1',
  width: 80,
  scopedSlots: { customRender: 'faultTreeIds1' }
}, {
  // 问题等级
  title: 'gradeName',
  dataIndex: 'gradeName',
  width: 100,
  scopedSlots: { customRender: 'gradeName' },
  sorter: true
}, {
  // 问题分类
  title: 'sourceName',
  dataIndex: 'sourceName',
  width: 120,
  scopedSlots: { customRender: 'sourceName' }
}, {
  // 问题阶段
  title: 'projectPhase',
  dataIndex: 'projectPhase',
  width: 160,
  scopedSlots: { customRender: 'projectPhase' }
}, {
  // TODO: 目前取出来是草稿，后台修改后变为：D0、D1、D2....
  title: 'status',
  dataIndex: 'status',
  width: 100,
  sorter: true,
  scopedSlots: { customRender: 'status' }
}, {
  // 立项时间
  title: 'projectDate',
  dataIndex: 'projectDate',
  width: 108,
  scopedSlots: { customRender: 'projectDate' },
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
}, {
  // 接受日期
  title: 'receiveDate',
  dataIndex: 'receiveDate',
  width: 108,
  scopedSlots: { customRender: 'receiveDate' },
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
}];

const transformField = mapping => list => {
  const keys = Object.keys(mapping);
  return list.map(item => {
    const obj = {};
    keys.forEach(key => {
      obj[key] = item[mapping[key]];
    });
    return obj;
  });
};

export const transform1 = transformField({ value: 'id', label: 'name' });
export const transform2 = transformField({ value: 'id', label: 'dictName' });
export const transform3 = transformField({ value: 'id', label: 'nameZh' });
