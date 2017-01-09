var prefix = '\u001B[33m[2webpack2]\u001B[39m'
var sep = ' - '

exports.warn = function (msg) {
  console.warn(prefix, sep, msg)
}

/* istanbul ignore next */
exports.fatal = function (msg) {
  throw new Error(prefix + sep + msg)
}
