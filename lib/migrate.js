var webpack = require('webpack')
var set = require('object-set')
var log = require('./log')
var loader = require('./loader')

var schema
try {
  schema = require('webpack/schemas/webpackOptionsSchema.json')
} catch (err) {}

var props = schema ? Object.keys(schema.properties) : []

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
  this.handleResolveModules()
  this.cleanEmptyExtension()

  // loader
  this.config.module = this.config.module || {}
  this.config.module.rules = this.config.module.rules || []
  this.moveLoader()
  this.addLoaderSuffix()

  // plugin
  this.config.plugins = this.config.plugins || []
  this.removeOccurrenceOrderPlugin()
  this.moveToLoaderOptions()
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#resolve-root-resolve-fallback-resolve-modulesdirectories
 */
Migrate.prototype.handleResolveModules = function () {
  var resolve = this.config.resolve
  var list = ['root', 'fallback', 'modulesDirectories']

  if (!resolve) {
    return
  }

  resolve.modules = resolve.modules || []
  list.forEach(function (item) {
    if (resolve[item]) {
      resolve.modules = resolve.modules.concat(resolve[item])
      delete resolve[item]
    }
  })

  if (resolve.modules.indexOf('node_modules') === -1) {
    resolve.modules.push('node_modules')
  }
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#resolve-extensions
 */
Migrate.prototype.cleanEmptyExtension = function () {
  if (!this.config.resolve || !this.config.resolve.extensions) {
    return
  }

  this.config.resolve.extensions = this.config.resolve.extensions.filter(function (i) {
    return Boolean(i)
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#module-preloaders-and-module-postloaders-was-removed
 */
Migrate.prototype.moveLoader = function () {
  var module = this.config.module
  var rules = module.rules
  var move = {
    loaders: null,
    postLoaders: {enforce: 'post'},
    preLoaders: {enforce: 'pre'}
  }

  Object.keys(move).forEach(function (prop) {
    var loaders = module[prop]

    if (Array.isArray(loaders)) {
      loaders.forEach(function (l) {
        rules.push(Object.assign(loader.fixLoader(l), move[prop]))
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
    if (typeof rule.loader === 'string') {
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
Migrate.prototype.removeOccurrenceOrderPlugin = function () {
  this.config.plugins = this.config.plugins.filter(function (p) {
    return p.constructor.name !== 'OccurrenceOrderPlugin'
  })
}

/**
 * https://webpack.js.org/how-to/upgrade-from-webpack-1/#loaderoptionsplugin-context
 */
Migrate.prototype.moveToLoaderOptions = function () {
  var prop
  var conf = {
    options: {}
  }
  var quiet = this.options.quiet

  for (prop in this.config) {
    if (props.indexOf(prop) === -1) {
      set(conf.options, prop, this.config[prop])
      delete this.config[prop]
      if (!quiet) {
        log.warn('move unknown property \'' + prop + '\' to LoaderOptions')
      }
    }
  }

  // some loader need context, such as vue-loader for css-loaer
  if (this.options.context) {
    set(conf, 'options.context', this.options.context === true ? process.cwd() : this.options.context)
  }

  this.config.plugins.push(new webpack.LoaderOptionsPlugin(conf))
}

module.exports = Migrate
