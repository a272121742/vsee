
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 200,
  align: 'center',
  fixed: 'left',
};
const plantNm = {
  dataIndex: 'plant_nm',
  scopedSlots: {
    customRender: 'plant_nm',
  },
  width: 90,
  align: 'center',
};

const vhclModel = {
  dataIndex: 'vhcl_model',
  scopedSlots: {
    customRender: 'vhcl_model',
  },
  width: 100,
  align: 'center',
  fixed: 'left',
};

const workshopNm = {
  dataIndex: 'workshop_nm',
  scopedSlots: {
    customRender: 'workshop_nm',
  },
  align: 'center',
  width: 90,
};

const insptTime = {
  dataIndex: 'inspt_time',
  scopedSlots: {
    customRender: 'inspt_time',
  },
  width: 160,
  align: 'center',
};

const prodProdlineNm = {
  dataIndex: 'prod_prodline_nm',
  scopedSlots: {
    customRender: 'prod_prodline_nm',
  },
  align: 'center',
  width: 70,
};
const mfrCd = {
  dataIndex: 'mfr_cd',
  scopedSlots: {
    customRender: 'mfr_cd',
  },
  align: 'center',
  width: 110,
};
const mfrNm = {
  dataIndex: 'mfr_nm',
  scopedSlots: {
    customRender: 'mfr_nm',
  },
  align: 'center',
  width: 110,
};

const eqpCd = {
  dataIndex: 'eqp_cd',
  scopedSlots: {
    customRender: 'eqp_cd',
  },
  width: 100,
  align: 'center',
};
const eqpNm = {
  dataIndex: 'eqp_nm',
  scopedSlots: {
    customRender: 'eqp_nm',
  },
  align: 'center',
  width: 100,
};
const eqpType = {
  dataIndex: 'eqp_type',
  scopedSlots: {
    customRender: 'eqp_type',
  },
  align: 'center',
  width: 100,
};
const dataType = {
  dataIndex: 'data_type',
  scopedSlots: {
    customRender: 'data_type',
  },
  width: 100,
  align: 'center',
};
const opreationType = {
  dataIndex: 'opreation_type',
  scopedSlots: {
    customRender: 'opreation_type',
  },
  width: 100,
  align: 'center',
};
const seqNo = {
  dataIndex: 'seq_no',
  scopedSlots: {
    customRender: 'seq_no',
  },
  width: 90,
  align: 'center',
};
const versNo = {
  dataIndex: 'vers_no',
  scopedSlots: {
    customRender: 'vers_no',
  },
  width: 80,
  align: 'center',
};
const prodAddr = {
  dataIndex: 'prod_addr',
  scopedSlots: {
    customRender: 'prod_addr',
  },
  width: 90,
  align: 'center',
};
const prodYear = {
  dataIndex: 'prod_year',
  scopedSlots: {
    customRender: 'prod_year',
  },
  width: 90,
  align: 'center',
};
const totalResult = {
  dataIndex: 'total_result',
  scopedSlots: {
    customRender: 'total_result',
  },
  width: 90,
  align: 'center',
};
const insptDvc = {
  dataIndex: 'inspt_dvc',
  scopedSlots: {
    customRender: 'inspt_dvc',
  },
  width: 90,
  align: 'center',
};

const insptArea = {
  dataIndex: 'inspt_area',
  scopedSlots: {
    customRender: 'inspt_area',
  },
  width: 90,
  align: 'center',
};
const insptNo = {
  dataIndex: 'inspt_no',
  scopedSlots: {
    customRender: 'inspt_no',
  },
  width: 90,
  align: 'center',
};
const insptResult = {
  dataIndex: 'inspt_result',
  scopedSlots: {
    customRender: 'inspt_result',
  },
  width: 90,
  align: 'center',
};
const insptStation = {
  dataIndex: 'inspt_station',
  scopedSlots: {
    customRender: 'inspt_station',
  },
  width: 90,
  align: 'center',
};
const insptRls = {
  dataIndex: 'inspt_rls',
  scopedSlots: {
    customRender: 'inspt_rls',
  },
  width: 150,
  align: 'center',
};

export default {};

// 过点信息
export const isTestColumns = [
  vin,
  vhclModel,
  plantNm,
  workshopNm,
  insptTime,
  prodProdlineNm,
  mfrCd,
  mfrNm,
  eqpCd,
  eqpNm,
  eqpType,
  dataType,
  opreationType,
  seqNo,
  versNo,
  prodAddr,
  prodYear,
  totalResult,
  insptDvc,
  insptArea,
  insptNo,
  insptRls,
  insptResult,
  insptStation,
];
