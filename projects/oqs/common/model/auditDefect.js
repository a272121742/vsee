
// 1.vin
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  align: 'center',
  width: 200,
  fixed: 'left',
};

// 2.车型
const vhclModel = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  align: 'center',
  width: 100,
  fixed: 'left',
};

// 工厂
const plantNm = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  align: 'center',
};

// 车间
const workshopNm = {
  dataIndex: 'workshop_nm',
  scopedSlots: {
    customRender: 'workshop_nm',
  },
  align: 'center',
};

// 3.样车来源
const sampleSrc = {
  dataIndex: 'sample_src',
  scopedSlots: {
    customRender: 'sample_src',
  },
  align: 'center',
};

// 评审人
const auditorNm = {
  dataIndex: 'auditor_nm',
  scopedSlots: {
    customRender: 'auditor_nm',
  },
  align: 'center',
};

// 评审日期
const auditDate = {
  dataIndex: 'audit_date',
  scopedSlots: {
    customRender: 'audit_date',
  },
  align: 'center',
  width: 200,
};

// 审计部位
const auditPst = {
  dataIndex: 'audit_pst',
  scopedSlots: {
    customRender: 'audit_pst',
  },
  align: 'center',
};

// 审计零件
const partNm = {
  dataIndex: 'part_nm',
  scopedSlots: {
    customRender: 'part_nm',
  },
  align: 'center',
};

// 缺陷描述
const defect = {
  dataIndex: 'defect',
  scopedSlots: {
    customRender: 'defect',
  },
  align: 'center',
};

// 9.缺陷等级
const defectLevel = {
  dataIndex: 'defect_level',
  scopedSlots: {
    customRender: 'defect_level',
  },
  align: 'center',
};

// 10.分值
const score = {
  dataIndex: 'score',
  scopedSlots: {
    customRender: 'score',
  },
  align: 'center',
};

// 11.责任部门
const rspnsDeptNm = {
  dataIndex: 'rspns_dept_nm',
  scopedSlots: {
    customRender: 'rspns_dept_nm',
  },
};

// 12.备注
const remark = {
  dataIndex: 'remark',
  scopedSlots: {
    customRender: 'remark',
  },
  align: 'center',
};

export default {};

// 过点信息
export const auditDefectColumns = [
  vin,
  vhclModel,
  plantNm,
  workshopNm,
  sampleSrc,
  auditorNm,
  auditDate,
  auditPst,
  partNm,
  defect,
  defectLevel,
  score,
  rspnsDeptNm,
  remark,
];
