var to2 = require('../')

// module.exports = to2({
//   entry: './entry.js',
//   output: {
//     filename: 'app.js'
//   },
//   entry2: 'a'
// })

console.log(JSON.stringify(to2({
  entry: './entry.js',
  output: {
    filename: 'app.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'},
      {test: /\.css$/, loader: 'style!css?modules'}
    ]
  },
  entry2: 'a'
}), null, ' '))
