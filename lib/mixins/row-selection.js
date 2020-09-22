const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: true,
};

export default ({ rowKey = 'key', memory = false } = {}) => {
  const getRowKey = typeof rowKey === 'function' ? rowKey : (item) => item[rowKey];
  const selectedRows = new Map();

  function onPageChange () {
    if (memory) {
      // const
      // this.rowSelection.selectedRowKeys = selectedRows.map(getRowKey);
    } else {
      selectedRows.clear();
    }
    this.rowSelection.selectedRowKeys = [...selectedRows.keys()];
  }

  return {
    data () {
      const rowSelection = {
        selectedRowKeys: [],
      };
      Object.defineProperties(rowSelection, {
        columnWidth: {
          value: 40,
          ...propertiesConfig,
        },
        fixed: {
          value: true,
          ...propertiesConfig,
        },
        type: {
          value: 'checkbox',
          writable: true,
          configrable: false,
          enumerable: false,
        },
        multipleSelect: {
          configrable: false,
          enumerable: false,
          set: (value) => {
            this.rowSelection.type = value === true ? 'checkbox' : 'radio';
          },
        },
        getCheckboxProps: {
          value: (record) => {
            const result = { props: {} };
            const key = getRowKey(record);
            if (this.rowSelection.selectedRowKeys.includes(key)) {
              selectedRows.set(key, record);
            }
            result.props.name = key;
            result.props.key = key;
            const { disableOf } = this.rowSelection;
            if (disableOf && disableOf instanceof Function) {
              result.props.disabled = disableOf({ ...record });
            }
            return result;
          },
          writable: true,
          configrable: false,
          enumerable: false,
        },
        onChange: {
          value: (selectedRowKeys, selectRows) => {
            selectRows.forEach((record) => {
              const key = getRowKey(record);
              selectedRows.set(key, record);
            });
            this.rowSelection.selectedRowKeys = [...selectedRows.keys()];
            this.$emit('select', [...selectedRowKeys], selectRows, [...selectedRows.values()]);
          },
          ...propertiesConfig,
        },
        onSelect: {
          value: (record, selected) => {
            if (!selected) {
              const key = getRowKey(record);
              selectedRows.delete(key, record);
              this.rowSelection.selectedRowKeys = [...selectedRows.keys()];
            }
          },
          ...propertiesConfig,
        },
        onSelectAll: {
          value: (selected, selectRows, changeRows) => {
            if (!selected) {
              changeRows.forEach((record) => {
                this.rowSelection.onSelect(record, selected);
              });
            }
          },
          ...propertiesConfig,
        },
        push: {
          value: (data) => {
            const records = data instanceof Array ? data : [data];
            records.forEach((record) => {
              const key = getRowKey(record);
              selectedRows.set(key, record);
            });
            this.rowSelection.selectedRowKeys = [...selectedRows.keys()];
          },
          ...propertiesConfig,
          enumerable: false,
        },
        shift: {
          value: (data) => {
            const records = data instanceof Array ? data : [data];
            records.forEach((record) => {
              const key = getRowKey(record);
              selectedRows.delete(key);
            });
            this.rowSelection.selectedRowKeys = [...selectedRows.keys()];
          },
          ...propertiesConfig,
          enumerable: false,
        },
        clear: {
          value: () => {
            selectedRows.clear();
            this.rowSelection.selectedRowKeys = [];
          },
          ...propertiesConfig,
          enumerable: false,
        },
        load: {
          value: (records) => {
            this.rowSelection.clear();
            this.rowSelection.push(records);
          },
          ...propertiesConfig,
          enumerable: false,
        },
      });
      return { rowSelection };
    },
    computed: {
      selectedRows () {
        return (this.rowSelection.selectedRowKeys, [...selectedRows.values()]);
      },
    },
    watch: {
      'pagination.current': onPageChange,
      'pagination.pageSize': onPageChange,
    },
  };
};
