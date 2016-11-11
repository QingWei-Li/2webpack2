import test from 'ava'
import webpack from 'webpack'
import Migrate from '../lib/migrate'
import to2 from '../'

test('resolve', t => {
  const actual = new Migrate({
    resolve: {
      root: ['path/to/src', 'path/to/src2'],
      fallback: 'path/to/fallback',
      modulesDirectories: 'path/to/modulesDirectories'
    }
  })
  const fixture = {
    modules: [
      'path/to/src',
      'path/to/src2',
      'path/to/fallback',
      'path/to/modulesDirectories',
      'node_modules'
    ]
  }

  t.deepEqual(actual.resolve, fixture)
})

test('extensions', t => {
  const actual = new Migrate({
    resolve: {
      extensions: ['', '.js', '.vue']
    }
  })
  const fixture = ['.js', '.vue']

  t.deepEqual(actual.resolve.extensions, fixture)
})

test('loaders', t => {
  const actual = new Migrate({
    module: {
      loaders: [
        {test: /\.vue$/, loader: 'vue'},
        {test: /\.js$/, loader: 'babel-loader'},
        {test: /\.css$/, loader: 'style!css?modules'},
        {loader: 'node_modules/extract-text-webpack-plugin/loader.js'}
      ]
    }
  })
  const fixture = {
    rules: [
      {test: /\.vue$/, loader: 'vue-loader'},
      {test: /\.js$/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader?modules'},
      {loader: 'node_modules/extract-text-webpack-plugin/loader.js'}
    ]
  }

  t.deepEqual(actual.module, fixture)
})

test('fix loaders', t => {
  const actual = new Migrate({
    module: {
      loaders: [
        {loaders: ['vue'], options: {cssModules: true}}
      ]
    }
  })
  const fixture = {
    rules: [
      {loader: 'vue-loader', options: {cssModules: true}}
    ]
  }

  t.deepEqual(actual.module, fixture)
})

test('postLoaders nad preLoaders', t => {
  const actual = new Migrate({
    module: {
      preLoaders: [
        {test: /\.js$/, loader: 'eslint'}
      ],
      postLoaders: [
        {test: /\.less$/, loaders: ['style', 'postcss']}
      ]
    }
  })
  const fixture = {
    rules: [
      {test: /\.less$/, loaders: ['style-loader', 'postcss-loader'], enforce: 'post'},
      {test: /\.js$/, loader: 'eslint-loader', enforce: 'pre'}
    ]
  }

  t.deepEqual(actual.module, fixture)
})

test('loader suffix', t => {
  const actual = new Migrate({
    module: {
      loaders: [
        {loader: 'vue-loader!babel?presets=es2015'},
        {loader: 'style!css?modules!postcss!less'}
      ]
    }
  })
  const fixture = {
    rules: [
      {loader: 'vue-loader!babel-loader?presets=es2015'},
      {loader: 'style-loader!css-loader?modules!postcss-loader!less-loader'}
    ]
  }

  t.deepEqual(actual.module, fixture)
})

test('remove OccurrenceOrder', t => {
  const actual = new Migrate({
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin()
    ]
  })

  t.is(actual.plugins.length, 1)
})

test('other option', t => {
  const actual = new Migrate({
    debug: true,
    entry: 'xxx',
    vue: {}
  })
  const keys = Object.keys(actual);

  t.not(keys.indexOf('entry'), -1)
  t.not(keys.indexOf('plugins'), -1)
  t.is(keys.indexOf('debug'), -1)
  t.is(keys.indexOf('vue'), -1)
})

test('to2: array', t => {
  const actual = to2([
    {
      entry: 'xxx'
    },
    {
      entry: 'xxx'
    }
  ])

  t.true(Array.isArray(actual))
})

test('to2: object', t => {
  const actual = to2({
    entry: 'xxx'
  })

  t.is(actual.entry, 'xxx')
})

test('options: quiet', t => {
  const actual = to2({
    debug: true
  }, {quiet: true})

  t.falsy(actual.debug)
})
