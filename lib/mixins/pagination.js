import { PAGINATION } from '@lib/config.js';

const {
  PAGESIZE_OPTIONS,
  SERVER_PARAMS,
} = PAGINATION;

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: true,
};

const pageSizeOptions = PAGESIZE_OPTIONS;
const showQuickJumper = true;
const showSizeChanger = true;
const _current = 1;
const _pageSize = parseInt(PAGESIZE_OPTIONS[0], 10) || 10;
const total = 0;

function showTotal (totals) {
  return [this.$t('page.total'), totals, this.$t('page.article')].join('');
}

/**
 * @param String current - 服务端存储当前页的键名
 * @param String pageSize - 服务端存储分页数的键名
 */
export default ({ current = 'page', pageSize = 'limit' } = {}) => ({
  data () {
    const pagination = {
      current: _current,
      pageSize: _pageSize,
      disabled: false,
      total,
      showTotal,
      showQuickJumper,
      showSizeChanger,
      pageSizeOptions,
    };
    const change = (page, size) => {
      if (page && typeof page === 'number') {
        this.pagination.current = page;
      }
      if (size && typeof size === 'number') {
        this.pagination.pageSize = size;
      }
    };
    Object.defineProperties(pagination, {
      onChange: {
        value: change,
        ...propertiesConfig,
      },
      onShowSizeChange: {
        value: change,
        ...propertiesConfig,
      },
      reset: {
        value: () => change(_current, _pageSize),
        ...propertiesConfig,
      },
      resetCurrent: {
        value: () => change(_current),
        ...propertiesConfig,
      },
      resetPageSize: {
        value: () => change(_pageSize),
        ...propertiesConfig,
      },
    });
    return {
      pagination,
    };
  },
  computed: {
    serverPagination () {
      const serverCurrent = this.pagination.current || _current;
      const serverPageSize = this.pagination.pageSize || _pageSize;
      if (SERVER_PARAMS instanceof Function) {
        return SERVER_PARAMS({ page: serverCurrent, limit: serverPageSize });
      }
      return {
        [current]: serverCurrent,
        [pageSize]: serverPageSize,
      };
    },
  },
});
