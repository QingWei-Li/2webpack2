var _toStr = Object.prototype.toString

exports.str = function (o) {
  return _toStr.call(o) === '[object String]'
}
