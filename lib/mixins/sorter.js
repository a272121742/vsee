import Vue from 'vue';
import { SORTER } from '@lib/config.js';

const { SERVER_PARAMS, TYPES } = SORTER;

const propertiesConfig = {
  writable: false,
  configrable: false,
  enumerable: false,
};

const types = {
  ascend: 'ascend',
  descend: 'descend',
};

export default () => {
  const sorters = Vue.observable({
    sortField: [],
    sorter: {
      type: false,
      field: null,
    },
  });
  sorters.default = {
    type: false,
    field: null,
  };
  return {
    filters: {
      sortable (col) {
        return (
          [].includes.call(sorters.sortField, col.dataIndex)
          || sorters.sorter.field === col.dataIndex
        );
      },
      orderby (col) {
        return sorters.sorter.field === col.dataIndex && sorters.sorter.type;
      },
    },
    data () {
      Object.defineProperties(sorters.sorter, {
        set: {
          value: (field, type = false) => {
            this.sorter.type = types[type] || false;
            this.sorter.field = field || null;
            sorters.sorter = this.sorter.valueOf();
          },
          ...propertiesConfig,
        },
        setType: {
          value: (type = false) => {
            this.sorter.type = types[type] || false;
            sorters.sorter = this.sorter.valueOf();
          },
          ...propertiesConfig,
        },
        setField: {
          value: (field) => {
            this.sorter.field = field || null;
            sorters.sorter = this.sorter.valueOf();
          },
          ...propertiesConfig,
        },
        reset: {
          value: () => {
            const { field, type } = sorters.default;
            this.sorter.field = field;
            this.sorter.type = type;
            sorters.sorter = this.sorter.valueOf();
          },
          ...propertiesConfig,
        },
        valueOf: {
          value: () => {
            const { field, type } = this.sorter;
            return { field, type };
          },
          ...propertiesConfig,
        },
      });
      return {
        sortField: sorters.sortField,
        sorter: sorters.sorter,
      };
    },
    created () {
      Object.assign(sorters.default, this.sorter.valueOf());
      sorters.sorter = this.sorter.valueOf();
      sorters.sortField = [...this.sortField];
      this.$watch('sortField', (value) => {
        sorters.sortField = [...value];
      });
    },
    computed: {
      serverSorter () {
        const { field, type } = this.sorter;
        return SERVER_PARAMS({ field, type: TYPES[type] });
      },
    },
  };
};
