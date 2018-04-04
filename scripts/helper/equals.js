'use strict'

function stringify (value) {
  // Handle MongoDB's ObjectID
  if (value && value.constructor.name === 'ObjectID') {
    return value.toString()
  }

  return (typeof value === 'object')
    ? JSON.stringify(value)
    : value
}

module.exports = function (v1, v2, options) {
  v1 = stringify(v1)
  v2 = stringify(v2)

  return (v1 === v2)
    ? options.fn(this)
    : options.inverse(this)
}
