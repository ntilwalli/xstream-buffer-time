function noop() {}

module.exports = {
  require: {
    'xstream': require('xstream').default,
    'xstream/extra/fromDiagram': require('xstream/extra/fromDiagram').default,
    ['xstream-buffer-time']: require('./index').default
  },

  globals: {
    setInterval: noop,
    console: {
      log: noop,
      error: noop,
    },

    listener: {
      next: noop,
      error: noop,
      complete: noop,
    },
  },
};
