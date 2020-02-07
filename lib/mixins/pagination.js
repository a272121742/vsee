const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: true,
};
const pageSizeOptions = ['10', '20', '50'];
const showQuickJumper = true;
const showSizeChanger = true;
const _current = 1;
const _pageSize = 10;
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
      total,
      showTotal,
      showQuickJumper,
      showSizeChanger,
      pageSizeOptions,
    };
    const change = (page, size) => {
      this.pagination.current = page;
      this.pagination.pageSize = size;
      // if (this.rowSelection) {
      //   this.selectedRows = [];
      //   this.rowSelection.selectedRowKeys = [];
      // }
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
    });
    return {
      pagination,
    };
  },
  computed: {
    serverPagination () {
      const serverPagination = {};
      serverPagination[current] = this.pagination.current || _current;
      serverPagination[pageSize] = this.pagination.pageSize || _pageSize;
      return serverPagination;
    },
  },
});
