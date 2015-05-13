'use strict'

let Client = require('./client')

module.exports = function create(opts) {
  return new Client(opts)
}
