const setAsDefault = require('./src/set-as-default.js');
const isDefault = require('./src/is-default.js');
const removeDefault = require('./src/remove-default.js');
const checkDefault = require('./src/check-default.js');

const protocolHandler = {
  setAsDefault: function (options) {
    return setAsDefault(options);
  },
  isDefault: function (options) {
    return isDefault(options);
  },
  removeDefault: function (options) {
    return removeDefault(options);
  },
  checkDefault: function (options) {
    return checkDefault(options);
  }
};

module.exports = protocolHandler;
