var xstream = require('xstream').default;
var sample = require('./index').default;

function noop() {}

module.exports = {
  require: {
    xstream: xstream,
    ['xstream-sample']: sample,
  },

  globals: {
    xs: xstream,
    stream: xstream.empty(),
    A: xstream.never(),
    B: xstream.never(),
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
