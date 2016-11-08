var to2 = require('../')

module.exports = to2({
  entry: './entry.js',
  output: {
    filename: 'app.js'
  },
  entry2: 'a'
})
