var isStr = require('./is').str

exports.addSuffix = function (loader, suffix) {
  suffix = isStr(suffix) ? suffix : '-loader'

  return new RegExp(suffix + '$', 'g').test(loader) ?
    loader :
    loader.replace(/(\w+)/, '$1' + suffix)
}
