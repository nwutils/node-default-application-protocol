const validateOptions = require('./src/validate-options.js');
const setAsDefault = require('./src/set-as-default.js');
const isDefault = require('./src/is-default.js');
const removeDefault = require('./src/remove-default.js');
const checkDefault = require('./src/check-default.js');

const protocolHandler = {
  setAsDefault: function (options) {
    options = validateOptions(options, 'setAsDefault');
    return setAsDefault(options);
  },
  isDefault: function (options) {
    options = validateOptions(options, 'isDefault');
    return isDefault(options);
  },
  removeDefault: function (options) {
    options = validateOptions(options, 'removeDefault');
    return removeDefault(options);
  },
  checkDefault: function (options) {
    options = validateOptions(options, 'checkDefault');
    return checkDefault(options);
  }
};

module.exports = protocolHandler;
