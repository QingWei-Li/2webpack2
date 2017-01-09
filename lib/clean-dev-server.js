var schema
try {
  schema = require('webpack-dev-server/lib/optionsSchema.json')
} catch (err) {}

module.exports = function (data) {
  /* istanbul ignore next */
  if (!schema) {
    return data
  }

  var props = Object.keys(schema.properties)

  for (var prop in data) {
    if (props.indexOf(prop) === -1) {
      delete data[prop]
    }
  }

  return data
}
