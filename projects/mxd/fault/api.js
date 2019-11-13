import ajax from '@lib/ajax.js';

export default {
  getPfsCategoryTree: () => ajax.get('/masterdata/v1/pfscategory/tree')
};