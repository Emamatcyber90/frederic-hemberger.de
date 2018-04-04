'use strict'

const cssnano = require('cssnano')

module.exports = function cssNano (cssFiles) {
  return function (files, metalsmith, done) {
    cssFiles = cssFiles.map((file) => {
      console.log('[metalsmith] Shrinking CSS file', file)
      return cssnano
        .process(files[file].contents.toString())
        .then((result) => {
          files[file].contents = Buffer.from(result.css)
        })
        .catch((err) => console.error('[metalsmith] Error shrinking file %s: %s', file, err))
    })

    Promise.all(cssFiles).then(() => done())
  }
}
