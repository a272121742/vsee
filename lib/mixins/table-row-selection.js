import { eqBy } from 'ramda';

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: false,
};

export default ({ rowKey = 'id', memory = true } = {}) => {
  const query = typeof rowKey === 'function' ? rowKey : (item) => item[rowKey];
  const eqByRowKey = eqBy(query);
  return {
    data () {
      const selectedRows = [];
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
        onChange: {
          value: (selectedRowKeys, selectRows) => {
            console.log(selectedRowKeys);
            if (memory) {
              this.rowSelection.selectedRowKeys = selectedRowKeys;
            } else {
              this.rowSelection.selectedRowKeys = selectRows.map(query);
              this.selectedRows = selectRows;
            }
            this.$emit('select', [...selectedRowKeys], [...selectRows]);
          },
          ...propertiesConfig,
        },
        onSelect: {
          value: (record, selected) => {
            if (memory) {
              if (selected) {
                this.selectedRows.push(record);
              } else {
                const index = this.selectedRows.findIndex((item) => eqByRowKey(item, record));
                if (index !== -1) {
                  this.selectedRows.splice(index, 1);
                }
              }
            }
          },
          ...propertiesConfig,
        },
        onSelectAll: {
          value: (selected, selectRows, changeRows) => {
            changeRows.forEach((record) => {
              this.rowSelection.onSelect(record, selected);
            });
          },
          ...propertiesConfig,
        },
      });
      return { rowSelection, selectedRows };
    },
  };
};
