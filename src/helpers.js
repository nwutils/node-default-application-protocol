const helpers = {
  throwError: function (options, message, error) {
    options = options || { verbose: true };

    if (options.verbose && options.customLogger) {
      options.customLogger(message, error);
    } else if (options.verbose && error) {
      console.error(
        '_________________________________\n' +
        'Node-Default-Application-Protocol:\n' +
        message,
        error
      );
    } else if (options.verbose) {
      console.error(
        '_________________________________\n' +
        'Node-Default-Application-Protocol:\n' +
        message
      );
    }
  }
};

module.exports = helpers;
