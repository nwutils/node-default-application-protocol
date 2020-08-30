const helpers = require('./helpers.js');

const TYPES_REQUIRING_PROTOCOL = [
  'setAsDefault',
  'isDefault',
  'removeDefault',
  'checkDefault'
];
const TYPES_REQUIRING_EXECUTABLE = [
];
const TYPES_REQUIRING_EXECUTABLE_DEFAULT = [
  'setAsDefault',
  'isDefault',
  'removeDefault'
];
const WINDOWS_BAD_CHARACTERS = [
  ' ',
  '"',
  '\'',
  '\\'
];
const EXECUTABLE_DEFAULT = process.execPath;

const validateVerbose = function (options) {
  if (typeof(options.verbose) !== 'boolean') {
    options.verbose = true;
  }
  return options;
};

const validateCustomLogger = function (options) {
  if (options.customLogger && typeof(options.customLogger) !== 'function') {
    delete options.customLogger;
    helpers.throwError(options, 'options.customLogger must be a type of function');
  }
  return options;
};

const validateProtocol = function (options, type) {
  if (TYPES_REQUIRING_PROTOCOL.includes(type)) {
    if (!options.protocol || typeof(options.protocol) !== 'string') {
      helpers.throwError(options, 'options.protocol is required and must be a string');
      delete options.protocol;
      return options;
    }

    // protocol      => .split('://')    => filter(Boolean)  => [0]
    // '://text'     => ['', 'text']     => ['text']         => 'text'
    // 'text://word' => ['text', 'word'] => ['text', 'word'] => 'text'
    // 'text://'     => ['text', '']     => ['text']         => 'text'
    options.protocol = options.protocol.split('://').filter(Boolean)[0];

    // We could check (process.platform === 'win32')
    // but if someone does not run their script on Windows they may not realize that the code won't work there.
    // Better to let them know sooner. Plus these restrictions are pretty reasonable.
    WINDOWS_BAD_CHARACTERS.forEach(function (character) {
      if (options.protocol.includes(character)) {
        helpers.throwError(options, 'Avoid using spaces, quotes, and backslashes in options.protocol', {
          protocol: options.protocol,
          character: character
        });
        delete options.protocol;
      }
    });
  }

  return options;
};

const validateExecutable = function (options, type) {
  if (options.executable && typeof(options.executable) !== 'string') {
    helpers.throwError(options, 'options.executable is optional but must be a string if passed in. Falling back to default');
    delete options.executable;
  }
  if (TYPES_REQUIRING_EXECUTABLE_DEFAULT.includes(type)) {
    options.executable = options.executable || EXECUTABLE_DEFAULT;
  }
  if (options.executable && !require('fs').existsSync(options.executable)) {
    helpers.throwError(options, 'options.executable does not point to a file that exists. Falling back to default', {
      executable: options.executable
    });
    options.executable = EXECUTABLE_DEFAULT;
  }

  return options;
};

const validateOptions = function (options, type) {
  options = options || {};
  options = validateVerbose(options);
  options = validateCustomLogger(options);
  options = validateProtocol(options, type);
  options = validateExecutable(options, type);

  // if missing required fields, return nothing
  if (
    (TYPES_REQUIRING_PROTOCOL.includes(type) && !options.protocol) ||
    (TYPES_REQUIRING_EXECUTABLE.includes(type) && !options.executable)
  ) {
    return;
  }

  return options;
};

module.exports = validateOptions;
