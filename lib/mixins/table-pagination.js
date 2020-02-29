const pageSizeOptions = ['10', '20', '50'];
const showQuickJumper = true;
const showSizeChanger = true;
const current = 1;
const pageSize = 10;
const total = 0;


function showTotal (totals) {
  return [this.$t('page.total'), totals, this.$t('page.article')].join('');
}
export default {
  data () {
    return {
      pagination: {
        current,
        pageSize,
        total,
        showTotal,
        showQuickJumper,
        showSizeChanger,
        pageSizeOptions,
        onChange: (page, limit) => {
          this.pagination.current = page;
          this.pagination.pageSize = limit;
        },
        onShowSizeChange: (page, size) => {
          this.pagination.current = page;
          this.pagination.pageSize = size;
        },
      },
    };
  },
  computed: {
    serverPagination () {
      const page = this.pagination.current || 1;
      const limit = this.pagination.pageSize || 10;
      return { page, limit };
    },
  },
};
