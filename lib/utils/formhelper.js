/**
 * 
 * @param {*} vm 
 * @param {*} fields 
 * @param {*} path 
 */
export const createFormFields = (vm, fields = [], path) => {
  const obj = vm[path] ? vm[path] : vm;
  const keys = fields.length ? fields : Object.keys(obj);
  const result = {}
  keys.forEach(key => {
    result[key] = vm.$form.createFormField({value: obj[key]});
  });
  return result;
};

export const autoUpdateFileds = (vm, path) => (props, values) => {
  const record = vm.hasOwnProperty(path) ? vm[path] : vm;
  const key = Object.keys(values)[0];
  record[key] = values[key];
};

