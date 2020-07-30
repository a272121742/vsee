// 1.vin 车架号
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 160,
  align: 'center',
};

// 2.vhclModelNm 车型名称
const vhclModelNm = {
  dataIndex: 'vhclModelNm',
  scopedSlots: {
    customRender: 'vhclModelNm',
  },
  width: 100,
  align: 'center',
};

// 3.vhclProjectCd 项目代号
const vhclProjectCd = {
  dataIndex: 'vhclProjectCd',
  scopedSlots: {
    customRender: 'vhclProjectCd',
  },
  width: 100,
  align: 'center',
};

// 4.lastUploadDt 最后数据上传时间
const lastUploadDt = {
  dataIndex: 'lastUploadDt',
  scopedSlots: {
    customRender: 'lastUploadDt',
  },
  width: 160,
  align: 'center',
};
// 5.terminalOnlineFlg 终端是否在线
const terminalOnlineFlg = {
  dataIndex: 'terminalOnlineFlg',
  scopedSlots: {
    customRender: 'terminalOnlineFlg',
  },
  width: 160,
  align: 'center',
};
// 6.canDataFlg CAN是否有数据
const canDataFlg = {
  dataIndex: 'canDataFlg',
  scopedSlots: {
    customRender: 'canDataFlg',
  },
  width: 160,
  align: 'center',
};
// 7.gpsLocateFlg  GPS是否定位
const gpsLocateFlg = {
  dataIndex: 'gpsLocateFlg',
  scopedSlots: {
    customRender: 'gpsLocateFlg',
  },
  width: 160,
  align: 'center',
};

// 8.batteryMinV 电池单体最低电压
const batteryMinV = {
  dataIndex: 'batteryMinV',
  scopedSlots: {
    customRender: 'batteryMinV',
  },
  width: 120,
  align: 'center',
};

// 9.batteryMaxV 电池单体最高电压
const batteryMaxV = {
  dataIndex: 'batteryMaxV',
  scopedSlots: {
    customRender: 'batteryMaxV',
  },
  width: 120,
  align: 'center',
};

// 10.batteryCutV 电池单体电压差
const batteryCutV = {
  dataIndex: 'batteryCutV',
  scopedSlots: {
    customRender: 'batteryCutV',
  },
  width: 120,
  align: 'center',
};

// 11.batteryMaxT 电池单体最高温度
const batteryMaxT = {
  dataIndex: 'batteryMaxT',
  scopedSlots: {
    customRender: 'batteryMaxT',
  },
  width: 120,
  align: 'center',
};

// 12.batteryMinT 电池单体最低温度
const batteryMinT = {
  dataIndex: 'batteryMinT',
  scopedSlots: {
    customRender: 'batteryMinT',
  },
  width: 120,
  align: 'center',
};

// 13. batteryCutT 电池单体温度差
const batteryCutT = {
  dataIndex: 'batteryCutT',
  scopedSlots: {
    customRender: 'batteryCutT',
  },
  width: 120,
  align: 'center',
};

// 14.lowvBatteryV 低压蓄电池电压
const lowvBatteryV = {
  dataIndex: 'lowvBatteryV',
  scopedSlots: {
    customRender: 'lowvBatteryV',
  },
  width: 120,
  align: 'center',
};

// 15.batterySoc 动力电池电量SOC值
const batterySoc = {
  dataIndex: 'batterySoc',
  scopedSlots: {
    customRender: 'batterySoc',
  },
  width: 120,
  align: 'center',
};

// 16.batteryCd 动力电池包编码
const batteryCd = {
  dataIndex: 'batteryCd',
  scopedSlots: {
    customRender: 'batteryCd',
  },
  width: 120,
  align: 'center',
};

// 17.bmsMainVers BMS主版本号
const bmsMainVers = {
  dataIndex: 'bmsMainVers',
  scopedSlots: {
    customRender: 'bmsMainVers',
  },
  width: 120,
  align: 'center',
};

// 18.bmsSecVers BMS次版本号
const bmsSecVers = {
  dataIndex: 'bmsSecVers',
  scopedSlots: {
    customRender: 'bmsSecVers',
  },
  width: 120,
  align: 'center',
};

// 19.mcuMainVers  MCU主版本号
const mainmcu = {
  dataIndex: 'mcuMainVers',
  scopedSlots: {
    customRender: 'mcuMainVers',
  },
  width: 120,
  align: 'center',
};

// 20.mcuSecVers MCU次版本号
const mcuSecVers = {
  dataIndex: 'mcuSecVers',
  scopedSlots: {
    customRender: 'mcuSecVers',
  },
  width: 120,
  align: 'center',
};

// 21.vcuMainVers  VCU主版本号
const vcuMainVers = {
  dataIndex: 'vcuMainVers',
  scopedSlots: {
    customRender: 'vcuMainVers',
  },
  width: 120,
  align: 'center',
};

// 22.vcuSecVers VCU次版本号
const vcuSecVers = {
  dataIndex: 'vcuSecVers',
  scopedSlots: {
    customRender: 'vcuSecVers',
  },
  width: 120,
  align: 'center',
};

// 23.eccMainVers ECC主版本号
const eccMainVers = {
  dataIndex: 'eccMainVers',
  scopedSlots: {
    customRender: 'eccMainVers',
  },
  width: 120,
  align: 'center',
};

// 24.eccSecVers  ECC次版本号
const eccSecVers = {
  dataIndex: 'eccSecVers',
  scopedSlots: {
    customRender: 'eccSecVers',
  },
  width: 120,
  align: 'center',
};

// 25.ehuMainVers 中控主机(EHU)主版本号
const ehuMainVers = {
  dataIndex: 'ehuMainVers',
  scopedSlots: {
    customRender: 'ehuMainVers',
  },
  width: 120,
  align: 'center',
};

// 26.ehuSecVers 中控主机(EHU)次版本号
const ehuSecVers = {
  dataIndex: 'ehuSecVers',
  scopedSlots: {
    customRender: 'ehuSecVers',
  },
  width: 120,
  align: 'center',
};

// 27.epsMainVers EPS主版本号
const epsMainVers = {
  dataIndex: 'epsMainVers',
  scopedSlots: {
    customRender: 'epsMainVers',
  },
  width: 120,
  align: 'center',
};

// 28.epsSecVers   EPS次版本号
const epsSecVers = {
  dataIndex: 'epsSecVers',
  scopedSlots: {
    customRender: 'epsSecVers ',
  },
  width: 120,
  align: 'center',
};

// 29.odoMileage  ODO里程
const odoMileage = {
  dataIndex: 'odoMileage',
  scopedSlots: {
    customRender: 'odoMileage',
  },
  width: 120,
  align: 'center',
};

// 13.crtDt 创建时间
const crtDt = {
  dataIndex: 'crtDt',
  scopedSlots: {
    customRender: 'crtDt',
  },
  width: 180,
  align: 'center',
};

// 14.realName 创建人
const realName = {
  dataIndex: 'realName',
  scopedSlots: {
    customRender: 'realName',
  },
  width: 180,
  align: 'center',
};

export default {};

export const vehicleBatteryStatusRecord = [
  vin,
  vhclModelNm,
  vhclProjectCd,
  lastUploadDt,
  terminalOnlineFlg,
  canDataFlg,
  gpsLocateFlg,
  batteryMinV,
  batteryMaxV,
  batteryCutV,
  batteryMaxT,
  batteryMinT,
  batteryCutT,
  lowvBatteryV,
  batterySoc,
  batteryCd,
  bmsMainVers,
  bmsSecVers,
  mainmcu,
  mcuSecVers,
  vcuMainVers,
  vcuSecVers,
  eccMainVers,
  eccSecVers,
  ehuMainVers,
  ehuSecVers,
  epsMainVers,
  epsSecVers,
  odoMileage,
  crtDt,
  realName,
];
