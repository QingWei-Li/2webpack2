var chalk = require('chalk')

var prefix = '[2webpack2]'
var sep = ' - '

exports.warn = function (msg) {
  console.warn(chalk.yellow(prefix), sep, msg)
}

exports.error = function (msg) {
  console.error(chalk.red(prefix), sep, msg)
}
