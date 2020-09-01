import config from '~/config.js';

function throwConfigError (msg, ...path) {
  throw new Error(`【配置错误】${msg}\r\n\t\t- file: ~/config.js\r\n\t\t- path: config.${path.join('.')}`);
}

function configured (value) {
  return ![void 0].includes(value);
}

const THEME = (() => {
  const {
    THEME: theme = {},
  } = config;
  const {
    DARK = false,
    LAYOUT_TYPE = 'menu',
    MENU_TYPE = void 0,
    CONTENT_HEAD = 'bread',
    TAB_TYPE = 2,
    MENU_COLLAPSIBLE = true,
    MENU_COLLAPSED = false,
    KEEP_ALIVE = true,

  } = theme;
  return {
    DARK, LAYOUT_TYPE, MENU_TYPE, CONTENT_HEAD, TAB_TYPE, MENU_COLLAPSIBLE, MENU_COLLAPSED, KEEP_ALIVE,
  };
})();

const PAGINATION = (() => {
  const {
    PAGINATION: pagination = {},
  } = config;
  const {
    PAGESIZE_OPTIONS = pagination.PAGESIZE_OPTIONS || ['10', '20', '50', '100'],
    SERVER_PARAMS = ({ page, limit } = {}) => ({ page, limit }),
  } = pagination;
  if (!(PAGESIZE_OPTIONS instanceof Array)) {
    throwConfigError('必须是数组', 'PAGINATION', 'PAGESIZE_OPTIONS');
  }
  if (configured(SERVER_PARAMS) && !(SERVER_PARAMS instanceof Function)) {
    throwConfigError('必须是函数', 'PAGINATION', 'SERVER_PARAMS');
  }
  return { PAGESIZE_OPTIONS, SERVER_PARAMS };
})();

const SORTER = (() => {
  const {
    SORTER: sorter = {},
  } = config;
  const {
    SERVER_PARAMS = ({ field, type } = {}) => {
      const result = {};
      if (field) {
        result.orderField = field;
        if (type) {
          result.order = type;
        }
      }
      return result;
    },
    TYPES = {
      ascend: 'asc',
      descend: 'desc',
    },
  } = sorter;
  if (configured(SERVER_PARAMS) && !(SERVER_PARAMS instanceof Function)) {
    throwConfigError('必须是函数', 'SORTER', 'SERVER_PARAMS');
  }
  if (configured(TYPES) && (!TYPES.ascend || !TYPES.descend)) {
    throwConfigError('必须是预定义对象格式 { ascend, descend }', 'SORTER', 'TYPES');
  }
  return { SERVER_PARAMS, TYPES };
})();

const UPLOADER = (() => {
  const {
    UPLOADER: uploader = {},
  } = config;
  const {
    SERVER_FILE = (cf) => ({
      id: cf.uid,
      name: cf.name,
      path: cf.url,
      size: cf.size,
    }),
    CLIENT_FILE = (sf = {}) => ({
      uid: sf.uid || sf.id,
      name: sf.name,
      url: sf.path,
      status: (sf.uid || sf.id) ? 'done' : 'error',
      size: sf.size,
      response: sf.response || sf.path || sf.name,
    }),
  } = uploader;
  if (configured(SERVER_FILE) && !(SERVER_FILE instanceof Function)) {
    throwConfigError('必须是函数', 'UPLOADER', 'SERVER_FILE');
  }
  if (configured(CLIENT_FILE) && !(CLIENT_FILE instanceof Function)) {
    throwConfigError('必须是函数', 'UPLOADER', 'CLIENT_FILE');
  }
  return { SERVER_FILE, CLIENT_FILE };
})();

const DATETIME = (() => {
  const {
    DATETIME: datetime = {},
  } = config;
  const {
    enable = true,
    RANGE_END = false,
    DATE_FORMAT = 'YYYY-MM-DD',
    TIME_FORMAT = 'HH:mm:ss',
    EMPTY_DATETIME_FORMAT = '-',
    START_FIELDNAME = (fieldname) => `${fieldname}Start`,
    END_FIELDNAME = (fieldname) => `${fieldname}End`,
  } = datetime;
  const DATETIME_FORMAT = datetime.DATETIME_FORMAT ? (
    datetime.DATETIME_FORMAT instanceof Function ? datetime.DATETIME_FORMAT(DATE_FORMAT, TIME_FORMAT) : datetime.DATETIME_FORMAT
  ) : `${DATE_FORMAT} ${TIME_FORMAT}`;
  const EMPTY_DATETIME_VALUE = [null, ''].includes(datetime.EMPTY_DATETIME_VALUE) ? datetime.EMPTY_DATETIME_VALUE : null;
  if (configured(START_FIELDNAME) && !(START_FIELDNAME instanceof Function)) {
    throwConfigError('必须是函数', 'DATETIME', 'START_FIELDNAME');
  }
  if (configured(END_FIELDNAME) && !(END_FIELDNAME instanceof Function)) {
    throwConfigError('必须是函数', 'DATETIME', 'END_FIELDNAME');
  }
  return {
    enable: !!enable,
    RANGE_END: !!RANGE_END,
    DATE_FORMAT,
    TIME_FORMAT,
    DATETIME_FORMAT,
    EMPTY_DATETIME_FORMAT,
    EMPTY_DATETIME_VALUE,
    START_FIELDNAME,
    END_FIELDNAME,
  };
})();

const WATER_MARK = (() => {
  const {
    WATER_MARK: waterMark = {},
  } = config;
  const {
    enable = false,
    width = 240,
    height = 135,
    fontSize = 14,
    fontFamily = 'Arial',
    fontWeight = 400,
    color = 'rgba(0, 0, 0, 0.08)',
    rotate = -15,
    zIndex = 5,
    content = '请勿外传',
  } = waterMark;
  return {
    enable, width, height, fontSize, fontFamily, fontWeight, color, rotate, zIndex, content,
  };
})();

const ICON = (() => {
  const {
    ICON: icon = {},
  } = config;
  let {
    url = [],
  } = icon;
  const {
    prefix = 'icon-',
  } = icon;
  if (configured(url) && typeof url === 'string') {
    url = [url];
  } else if (configured(url) && !(url instanceof Array)) {
    throwConfigError('必须是数组或字符串', 'ICON', 'url');
  }
  return { prefix, url };
})();

const ROUTER = (() => {
  const {
    ROUTER: router = {},
  } = config;
  const {
    HOME_COMP,
    MODE = 'history',
    CUSTOM = false,
    INJECT = {},
  } = router;
  if (configured(HOME_COMP) && !(HOME_COMP instanceof Function)) {
    throwConfigError('必须是一个返回组件的函数', 'ROUTER', 'HOME_COMP');
  }
  return {
    HOME_COMP, MODE, CUSTOM, INJECT,
  };
})();

const FORM = (() => {
  const {
    FORM: form = {},
  } = config;
  const {
    TRIGGER = ['change', 'blur'],
    VALIDATION = {},
  } = form;
  if (!(TRIGGER instanceof Array)) {
    throwConfigError('必须是数组', 'FORM', 'TRIGGER');
  }
  return { TRIGGER, VALIDATION };
})();

const HTTP = (() => {
  const {
    HTTP: http = {},
  } = config;
  const {
    TIMEOUT = 6000,
    HEADER = {},
    PROXY = null,
    GET_PARAMS = {},
    MOCK_LOG = true,
    RETRY_LIST = [],
    PARAMS_SERIALIZER = {},
    INTERCEPTORS = {},
  } = http;
  if (!(INTERCEPTORS.request instanceof Function)) {
    INTERCEPTORS.request = false;
  }
  if (!(INTERCEPTORS.response instanceof Function)) {
    INTERCEPTORS.response = false;
  }
  if (!(RETRY_LIST instanceof Array)) {
    throwConfigError('必须是数组', 'HTTP', 'RETRY_LIST');
  }
  let { RETRY_DELAY } = http;
  if (!(http.RETRY_DELAY > 0) || !(http.RETRY_DELAY < TIMEOUT)) {
    RETRY_DELAY = 400;
  }
  return {
    TIMEOUT, HEADER, PROXY, GET_PARAMS, MOCK_LOG, RETRY_LIST, RETRY_DELAY, PARAMS_SERIALIZER, INTERCEPTORS,
  };
})();

export default null;
export {
  THEME,
  PAGINATION,
  SORTER,
  UPLOADER,
  DATETIME,
  WATER_MARK,
  ICON,
  ROUTER,
  FORM,
  HTTP,
};
