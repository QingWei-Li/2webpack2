var log = require('./lib/log')
var loader = require('./lib/loader')

var level1props = ['amd', 'bail', 'cache', 'context', 'dependencies',
  'devServer', 'devtool', 'entry', 'externals', 'loader', 'module', 'name',
  'node', 'output', 'plugins', 'profile', 'recordsInputPath',
  'recordsOutputPath', 'recordsPath', 'resolve', 'resolveLoader', 'stats',
  'target', 'watch', 'watchOptions']

/**
 * migrate
 */
var Migrate = function (config, options) {
  this.config = config
  this.options = options || {}
  this.run()

  return this.config
}

Migrate.prototype.run = function () {
  this.handleResolve()
  this.cleanEmptyExtension()

  // loader
  this.config.module = this.config.module || {}
  this.config.module.rules = this.config.module.rules || []
  this.moveLoader()
  this.addLoaderSuffix()

  // plugin
  this.config.plugins = this.config.plugins || []
  this.removeOccurrenceOrderPlugin()

  this.clean()
}

/**
 * Simply remove unknown property
 */
Migrate.prototype.clean = function () {
  var prop
  var quiet = this.options.quiet

  for (prop in this.config) {
    if (level1props.indexOf(prop) === -1) {
      delete this.config[prop]
      if (!quiet) {
        log.warn('delete unknown property \'' + prop + '\'')
      }
    }
  }
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#resolve-root-resolve-fallback-resolve-modulesdirectories
 */
Migrate.prototype.handleResolve = function () {
  if (!this.config.resolve) {
    return
  }

  var list = ['root', 'fallback', 'modulesDirectories']
  var resolve = this.config.resolve

  list.forEach(function (item) {
    if (resolve[item]) {
      resolve.modules.push(resolve[item])
      delete resolve[item]
    }
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#resolve-extensions
 */
Migrate.prototype.cleanEmptyExtension = function () {
  if (!this.config.resolve || !this.config.resolve.extensions) {
    return
  }

  return this.config.resolve.extensions.filter(function (i) {
    return Boolean(i)
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#module-loaders-is-now-module-rules
 */
Migrate.prototype.handleLoader = function () {
  // TODO
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#module-preloaders-and-module-postloaders-was-removed
 */
Migrate.prototype.moveLoader = function () {
  var module = this.config.module
  var rules = module.rules
  var move = {
    loaders: null,
    postLoaders: {enforce: 'pre'},
    preLoaders: {enforce: 'post'}
  }

  Object.keys(move).forEach(function (prop) {
    var loader = module[prop]

    if (Array.isArray(loader)) {
      loader.forEach(function (item) {
        rules.push(Object.assign(item, move[prop]))
      })
      delete module[prop]
    }
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#automatic-loader-module-name-extension-removed
 */
Migrate.prototype.addLoaderSuffix = function () {
  var rules = this.config.module.rules

  rules.forEach(function (rule) {
    if (rule.loader) {
      rule.loader = rule.loader.split('!').map(loader.addSuffix).join('!')
    }
    if (rule.loaders) {
      rule.loaders = rule.loaders.map(loader.addSuffix)
    }
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#occurrenceorderplugin-is-now-on-by-default
 */
Migrate.prototype.removeOccurrenceOrderPlugin = function() {
  this.config.plugins = this.config.plugins.filter(function (p) {
    p.constructor.name !== 'OccurrenceOrderPlugin'
  })
}

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

exports.Migrate = Migrate
