var to2 = require('../')
var webpack = require('webpack')

module.exports = to2({
  entry: __dirname + '/entry.js',
  output: {
    filename: 'app.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'},
      {test: /\.css$/, loader: 'style!css?modules'}
    ]
  },
  entry2: 'a',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
})

console.log(JSON.stringify(module.exports, null, ' '))
