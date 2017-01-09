# 2webpack2
[![Build Status](https://travis-ci.org/QingWei-Li/2webpack2.svg?branch=master)](https://travis-ci.org/QingWei-Li/2webpack2)
[![Coverage Status](https://coveralls.io/repos/github/QingWei-Li/2webpack2/badge.svg?branch=master)](https://coveralls.io/github/QingWei-Li/2webpack2?branch=master)
[![npm](https://img.shields.io/npm/v/2webpack2.svg)](https://www.npmjs.com/package/2webpack2)

https://webpack.js.org/how-to/upgrade-from-webpack-1

> 🕳️ Turn configuration of webpack 1 to 2

## Installation
```shell
npm i 2webpack2 webpack@beta -D
```

## Usage
```javascript
var to2 = require('2webpack2')

module.exports = to2({
  debug: true,
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint' }
    ],
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.css$/, loader: 'style!css?modules' }
    ]
  },
  vue: {
    postcss: [
      require('autoprefixer')
    ]
  }
})
```

To

```javascript
{
  module: {
    rules: [
      { test: /\.js$/, loader: 'eslint-loader', enforce: 'pre' },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader?modules' }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        debug: true,
        vue: {
          postcss: [
            require('autoprefixer')
          ]
        }
      }
    })
  ]
}
```

## Options
- quiet
- context


## License
MIT
