// 1.vin 车架号
const vin = {
  dataIndex: 'vin',
  scopedSlots: {
    customRender: 'vin',
  },
  width: 160,
  align: 'center',
};

// 2.modelname 车型名称
const modelname = {
  dataIndex: 'modelname',
  scopedSlots: {
    customRender: 'modelname',
  },
  width: 100,
  align: 'center',
};

// 3.projectcode项目代号
const projectcode = {
  dataIndex: 'projectcode',
  scopedSlots: {
    customRender: 'projectcode',
  },
  width: 100,
  align: 'center',
};

// 4.lastdatetime 最后数据上传时间
const lastdatetime = {
  dataIndex: 'lastdatetime',
  scopedSlots: {
    customRender: 'lastdatetime',
  },
  width: 160,
  align: 'center',
};
// 5.isonline 终端是否在线
const isonline = {
  dataIndex: 'isonline',
  scopedSlots: {
    customRender: 'isonline',
  },
  width: 160,
  align: 'center',
};
// 6.iscan CAN是否有数据
const iscan = {
  dataIndex: 'iscan',
  scopedSlots: {
    customRender: 'iscan',
  },
  width: 160,
  align: 'center',
};
// 7.isgpslocation  GPS是否定位
const isgpslocation = {
  dataIndex: 'isgpslocation',
  scopedSlots: {
    customRender: 'isgpslocation',
  },
  width: 160,
  align: 'center',
};

// 8.minvoltage 电池单体最低电压
const minvoltage = {
  dataIndex: 'minvoltage',
  scopedSlots: {
    customRender: 'minvoltage',
  },
  width: 120,
  align: 'center',
};

// 9.maxvoltage 电池单体最高电压
const maxvoltage = {
  dataIndex: 'maxvoltage',
  scopedSlots: {
    customRender: 'maxvoltage',
  },
  width: 120,
  align: 'center',
};

// 10.voltageDiffer 电池单体电压差
const voltageDiffer = {
  dataIndex: 'voltageDiffer',
  scopedSlots: {
    customRender: 'voltageDiffer',
  },
  width: 120,
  align: 'center',
};

// 11.maxtemperature 电池单体最高温度
const maxtemperature = {
  dataIndex: 'maxtemperature',
  scopedSlots: {
    customRender: 'maxtemperature',
  },
  width: 120,
  align: 'center',
};

// 12.mintemperature 电池单体最低温度
const mintemperature = {
  dataIndex: 'mintemperature',
  scopedSlots: {
    customRender: 'mintemperature',
  },
  width: 120,
  align: 'center',
};

// 13. temperatureDiffer 电池单体温度差
const temperatureDiffer = {
  dataIndex: 'temperatureDiffer',
  scopedSlots: {
    customRender: 'temperatureDiffer',
  },
  width: 120,
  align: 'center',
};

// 14.batteryvoltage 低压蓄电池电压
const batteryvoltage = {
  dataIndex: 'batteryvoltage',
  scopedSlots: {
    customRender: 'batteryvoltage',
  },
  width: 120,
  align: 'center',
};

// 15.soc 动力电池电量SOC值
const soc = {
  dataIndex: 'soc',
  scopedSlots: {
    customRender: 'soc',
  },
  width: 120,
  align: 'center',
};

// 16.batterycode 动力电池包编码
const batterycode = {
  dataIndex: 'batterycode',
  scopedSlots: {
    customRender: 'batterycode',
  },
  width: 120,
  align: 'center',
};

// 17.mainbms BMS主版本号
const mainbms = {
  dataIndex: 'mainbms',
  scopedSlots: {
    customRender: 'mainbms',
  },
  width: 120,
  align: 'center',
};

// 18.secondbms BMS次版本号
const secondbms = {
  dataIndex: 'secondbms',
  scopedSlots: {
    customRender: 'secondbms',
  },
  width: 120,
  align: 'center',
};

// 19.mainmcu  MCU主版本号
const mainmcu = {
  dataIndex: 'mainmcu',
  scopedSlots: {
    customRender: 'mainmcu',
  },
  width: 120,
  align: 'center',
};

// 20.secondmcu MCU次版本号
const secondmcu = {
  dataIndex: 'secondmcu',
  scopedSlots: {
    customRender: 'secondmcu',
  },
  width: 120,
  align: 'center',
};

// 21.mainvcu  VCU主版本号
const mainvcu = {
  dataIndex: 'mainvcu',
  scopedSlots: {
    customRender: 'mainvcu',
  },
  width: 120,
  align: 'center',
};

// 22.secondvcu VCU次版本号
const secondvcu = {
  dataIndex: 'secondvcu',
  scopedSlots: {
    customRender: 'secondvcu',
  },
  width: 120,
  align: 'center',
};

// 23.mainecc ECC主版本号
const mainecc = {
  dataIndex: 'mainecc',
  scopedSlots: {
    customRender: 'mainecc',
  },
  width: 120,
  align: 'center',
};

// 24.secondecc  ECC次版本号
const secondecc = {
  dataIndex: 'secondecc',
  scopedSlots: {
    customRender: 'secondecc',
  },
  width: 120,
  align: 'center',
};

// 25.mainehu 中控主机(EHU)主版本号
const mainehu = {
  dataIndex: 'mainehu',
  scopedSlots: {
    customRender: 'mainehu',
  },
  width: 120,
  align: 'center',
};

// 26.secondehu 中控主机(EHU)次版本号
const secondehu = {
  dataIndex: 'secondehu',
  scopedSlots: {
    customRender: 'secondehu',
  },
  width: 120,
  align: 'center',
};

// 27.maineps EPS主版本号
const maineps = {
  dataIndex: 'maineps',
  scopedSlots: {
    customRender: 'maineps',
  },
  width: 120,
  align: 'center',
};

// 28.secondeps  EPS次版本号
const secondeps = {
  dataIndex: 'secondeps',
  scopedSlots: {
    customRender: 'secondeps',
  },
  width: 120,
  align: 'center',
};

// 29.odomileage  ODO里程
const odomileage = {
  dataIndex: 'odomileage',
  scopedSlots: {
    customRender: 'odomileage',
  },
  width: 120,
  align: 'center',
};

export default {};

export const vehicleBatteryActualStatusColumns = [
  vin,
  modelname,
  projectcode,
  lastdatetime,
  isonline,
  iscan,
  isgpslocation,
  minvoltage,
  maxvoltage,
  voltageDiffer,
  maxtemperature,
  mintemperature,
  temperatureDiffer,
  batteryvoltage,
  soc,
  batterycode,
  mainbms,
  secondbms,
  mainmcu,
  secondmcu,
  mainvcu,
  secondvcu,
  mainecc,
  secondecc,
  mainehu,
  secondehu,
  maineps,
  secondeps,
  odomileage,
];
