import Vue from 'vue';
import { eqBy, uniqWith } from 'ramda';

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: false,
};

export default ({ rowKey = 'id', memory = true } = {}) => {
  const query = typeof rowKey === 'function' ? rowKey : (item) => item[rowKey];
  const eqByRowKey = eqBy(query);
  const uniqWithRowKey = uniqWith(eqByRowKey);
  const selectedRows = Vue.observable([]);
  const rowSelection = {
    selectedRowKeys: [],
  };
  function onPageChange () {
    if (memory) {
      this.rowSelection.selectedRowKeys = selectedRows.map(query);
    } else {
      selectedRows.length = 0;
    }
  }
  return {
    data () {
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
        onChange: {
          value: (selectedRowKeys, selectRows) => {
            if (memory) {
              this.rowSelection.selectedRowKeys = selectedRowKeys;
              const historySelectedRow = [...selectedRows];
              selectedRows.length = 0;
              selectedRows.push(...uniqWithRowKey([...historySelectedRow, ...selectRows]));
            } else {
              this.rowSelection.selectedRowKeys = selectRows.map(query);
              selectedRows.length = 0;
              selectedRows.push(...selectRows);
            }
            this.$emit('select', [...selectedRowKeys], [...selectedRows]);
          },
          ...propertiesConfig,
        },
        onSelect: {
          value: (record, selected) => {
            if (!selected) {
              const index = selectedRows.findIndex((item) => eqByRowKey(item, record));
              if (index !== -1) {
                selectedRows.splice(index, 1);
              }
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
          value: (records) => {
            const historySelectedRow = [...selectedRows];
            selectedRows.length = 0;
            selectedRows.push(...uniqWithRowKey([...historySelectedRow, ...records]));
            this.rowSelection.selectedRowKeys = selectedRows.map(query);
          },
          ...propertiesConfig,
        },
      });
      return { rowSelection: Object.freeze(rowSelection) };
    },
    computed: {
      selectedRows () {
        return selectedRows;
      },
    },
    watch: {
      'pagination.current': onPageChange,
      'pagination.pageSize': onPageChange,
    },
  };
};
