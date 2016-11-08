var log = require('./lib/log')

var level1props = ['amd', 'bail', 'cache', 'context', 'dependencies',
  'devServer', 'devtool', 'entry', 'externals', 'loader', 'module', 'name',
  'node', 'output', 'plugins', 'profile', 'recordsInputPath',
  'recordsOutputPath', 'recordsPath', 'resolve', 'resolveLoader', 'stats',
  'target', 'watch', 'watchOptions']

/**
 * Simply remove unknown property
 */
var clean = function(config, opts) {
  var prop

  for (prop in config) {
    if (level1props.indexOf(prop) === -1) {
      delete config[prop]
      !opts.quiet && log.warn('delete unknown property \'' + prop + '\'')
    }
  }

  return config
}

var loader = function(config, opts) {

}

/**
 * migrate
 */
var Migrate = function(config, options) {
  this.config = config
  this.options = options || {}
  this.run()

  return this.config
}

Migrate.prototype.run = function() {
  this.handleResolve()
  this.cleanEmptyExtension()
  this.clean()
}

Migrate.prototype.clean = function() {
  var prop
  var quiet = this.options.quiet

  for (prop in this.config) {
    if (level1props.indexOf(prop) === -1) {
      delete this.config[prop]
      !quiet && log.warn('delete unknown property \'' + prop + '\'')
    }
  }
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#resolve-root-resolve-fallback-resolve-modulesdirectories
 */
Migrate.prototype.handleResolve = function() {
  if (!this.config.resolve) return

  var list = ['root', 'fallback', 'modulesDirectories']
  var resolve = this.config.resolve

  list.forEach(function(item) {
    if (resolve[item]) {
      resolve.modules.push(resolve[item])
      delete resolve[item]
    }
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#resolve-extensions
 */
Migrate.prototype.cleanEmptyExtension = function() {
  if (!this.config.resolve || !this.config.resolve.extensions) return

  return this.config.resolve.extensions.filter(function(i) {
    return !!i
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#module-loaders-is-now-module-rules
 */
Migrate.prototype.handleLoader = function() {

}

var to = function(config, opts) {
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

module.exports = to
