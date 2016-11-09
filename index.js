var Migrate = require('./lib/migrate')

module.exports = function (config, opts) {
  var result = []

  opts = opts || {}

  if (Array.isArray(config)) {
    config.forEach(function (c) {
      result.push(new Migrate(c, opts))
    })
  } else {
    result = new Migrate(config, opts)
  }

  return result
}
