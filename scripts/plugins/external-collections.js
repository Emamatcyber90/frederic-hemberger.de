'use strict'

const Fs = require('fs')
const Yaml = require('js-yaml')

module.exports = function externalCollections (options) {
  options = options || {}

  return function (files, metalsmith, done) {
    let metadata = metalsmith.metadata()
    metadata.collections = metadata.collections || {}

    Object.keys(options).forEach(function (key) {
      try {
        metadata.collections[key] = Yaml.safeLoad(Fs.readFileSync(options[key], 'utf8'))
      } catch (err) {
        done(err)
      }
    })

    done()
  }
}
