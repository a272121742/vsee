import { eqBy } from 'ramda';

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: true,
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
          enumerable: true,
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
  // computed: {
  //   rowSelection () {
  //     const vm = this;
  //     const result = {
  //       // 自定义列表选择框宽度 String|Number
  //       columnWidth: 40,
  //       // 自定义列表选择框标题 String|Vode
  //       // columnTitle: 'title',
  //       // 是否把选择框列固定在左边 Boolean
  //       fixed: true,
  //       type: vm.multipleSelect ? 'checkbox' : 'radio',
  //       selectedRowKeys: vm.selectedRowKeys,
  //       // 用户手动选择/取消选择某列的回调
  //       onChange: (selectedRowKeys, selectedRows) => {
  //         this.selectedRowKeys = selectedRowKeys;
  //         this.$emit('select', [...selectedRowKeys]);
  //       },
  //       onSelect: (record, selected) => {
  //         if (selected) {
  //           this.selectedRows.push(record);
  //         } else {
  //           const index = this.selectedRows.findIndex((item) => item.id === record.id);
  //           if (index !== -1) {
  //             this.selectedRows.splice(index, 1);
  //           }
  //         }
  //       },
  //       onSelectAll: (selected, selectedRows, changeRows) => {
  //         changeRows.forEach((record) => {
  //           result.onSelect(record, selected);
  //         });
  //       },
  //       // hideDefaultSelections: true,
  //       // selections: true,
  //     };
  //     return result;
  //   },
  // },
  };
};
