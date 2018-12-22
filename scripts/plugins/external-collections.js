'use strict'

const Fs = require('fs')
const Yaml = require('js-yaml')

module.exports = function externalCollections (options) {
  options = options || {}

  return function (files, metalsmith, done) {
    let metadata = metalsmith.metadata()
    metadata.collections = metadata.collections || {}

    Object.keys(options).forEach(function (collectionName) {
      try {
        let yamlContent = Yaml.safeLoad(Fs.readFileSync(options[collectionName], 'utf8'))

        yamlContent = yamlContent.map(item => {
          item.collection = [collectionName]
          return item
        })

        metadata.collections[collectionName] = yamlContent
      } catch (err) {
        done(err)
      }
    })

    done()
  }
}
