'use strict'

const Path = require('path')

module.exports = function inlineBaseCss () {
  return function (files, metalsmith, done) {
    const cssFile = 'static/css/styles.css'
    const baseCss = `<style>${files[cssFile].contents.toString()}</style>`
    const pattern = new RegExp(`<link rel="stylesheet" href="/?${cssFile}" media="all">`)

    Object.keys(files)
      .filter((file) => Path.extname(file) === '.html')
      .forEach((file) => {
        console.log(`[metalsmith] Inlining base CSS into ${file}`)

        const contents = files[file].contents.toString().replace(pattern, baseCss)
        files[file].contents = Buffer.from(contents, 'utf8')
      })

    done()
  }
}
