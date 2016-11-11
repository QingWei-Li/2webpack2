var isStr = require('./is').str

exports.addSuffix = function (loader, suffix) {
  if (/extract-text-webpack-plugin/.test(loader)) {
    return loader
  }

  suffix = isStr(suffix) ? suffix : '-loader'

  return new RegExp(suffix, 'g').test(loader) ?
    loader :
    loader.replace(/(\w+)/, '$1' + suffix)
}

/**
 * fix options/query cannot be used with loaders
 */
exports.fixLoader = function (loader) {
  if (Array.isArray(loader.loaders)) {
    if (loader.query || loader.options) {
      loader.loader = loader.loaders.join('!')
      delete loader.loaders
    }
  }

  return loader
}
