# 2webpack2
[![Build Status](https://travis-ci.org/QingWei-Li/2webpack2.svg?branch=master)](https://travis-ci.org/QingWei-Li/2webpack2)
[![Coverage Status](https://coveralls.io/repos/github/QingWei-Li/2webpack2/badge.svg?branch=master)](https://coveralls.io/github/QingWei-Li/2webpack2?branch=master)
[![npm](https://img.shields.io/npm/v/2webpack2.svg)](https://www.npmjs.com/package/2webpack2)

https://webpack.js.org/how-to/upgrade-from-webpack-1

> 🌚

## Installation
```shell
npm i 2webpack2 -D
```

## Usage
```javascript
var to2 = require('2webpack2')

module.exports = to2({
  debug: true,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css?modules' }
    ]
  }
})

// =>
// {
//   module: {
//     rules: [
//       { test: /\.js$/, loader: 'babel' },
//       {
//         test: /\.css$/,
//         use: [
//           { loader: 'style' },
//           { loader: 'css', options: { modules: true } }
//         ]
//       }
//     ]
//   },
//   plugins: [
//     new webpack.LoaderOptionsPlugin({
//       debug: true
//     })
//   ]
// }
```

## License
MIT
