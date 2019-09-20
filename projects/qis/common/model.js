import moment from 'moment';

// 问题列配置
export const issueColumns = [{
  // 问题编号
  title: 'code',
  dataIndex: 'code',
  width: 120,
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
  dataIndex: 'faultTreeIds1Name',
  width: 130,
  scopedSlots: { customRender: 'faultTreeIds1' }
}, {
  // 问题等级
  title: 'gradeName',
  dataIndex: 'gradeName',
  width: 150,
  scopedSlots: { customRender: 'gradeName' },
  sorter: true
}, {
  // 问题分类
  title: 'sourceName',
  dataIndex: 'sourceName',
  width: 140,
  scopedSlots: { customRender: 'sourceName' }
}, {
  // 问题阶段
  title: 'projectPhase',
  dataIndex: 'projectPhase',
  width: 140,
  scopedSlots: { customRender: 'projectPhase' }
}, {
  title: 'status',
  dataIndex: 'status',
  width: 110,
  scopedSlots: { customRender: 'status' },
  sorter: true
}, {
  // 立项时间
  title: 'projectDate',
  dataIndex: 'projectDate',
  width: 150,
  scopedSlots: { customRender: 'projectDate' },
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
}, {
  // 接受日期
  title: 'receiveDate',
  dataIndex: 'receiveDate',
  width: 150,
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
