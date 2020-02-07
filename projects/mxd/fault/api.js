import ajax from '@http';

export default {
  getPfsCategoryTree: () => ajax.get('/masterdata/v1/pfscategory/tree'),
};
