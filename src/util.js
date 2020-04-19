var util = {};
util.install = function(Vue, options) {
  Vue.prototype.extractArray = (value, key) => {
    return value.map(function(item) {
      return item[key];
    });
  };
};
export default util;
