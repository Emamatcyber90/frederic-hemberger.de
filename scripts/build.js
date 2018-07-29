#!/usr/bin/env node
'use strict'

const Metalsmith = require('metalsmith')

const autoprefixer = require('autoprefixer-stylus')
const collections = require('metalsmith-collections')
const feed = require('metalsmith-feed')
const discoverHelpers = require('metalsmith-discover-helpers')
const discoverPartials = require('metalsmith-discover-partials')
const layouts = require('metalsmith-layouts')
const markdown = require('metalsmith-markdown')
const prism = require('metalsmith-prism')
const permalinks = require('metalsmith-permalinks')
const stylus = require('metalsmith-stylus')
const htmlMinifier = require('metalsmith-html-minifier')

// Custom metalsmith plugins
const cssnano = require('./plugins/cssnano.js')
const externalCollections = require('./plugins/external-collections.js')
const filterStylusPartials = require('./plugins/filter-stylus-partials.js')
const inlineBaseCss = require('./plugins/inline-base-css.js')
const mergeCollections = require('./plugins/merge-collections.js')
const webmentions = require('./plugins/webmentions.js')

function onlyProduction (child) {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
    return function (files, metalsmith, done) {
      done()
    }
  }
  return child
}

function build () {
  console.time('[metalsmith] Build finished')
  Metalsmith(process.cwd())
    .metadata({
      site: {
        title: 'Frederic Hemberger',
        author: 'Frederic Hemberger',
        url: 'https://frederic-hemberger.de'
      }
    })
    .use(collections({
      articles: { pattern: 'articles/*.md', refer: false, sortby: 'date', reverse: true },
      thoughts: { pattern: 'thoughts/*.md', refer: false, sortby: 'date', reverse: true }
    }))
    .use(markdown({ langPrefix: 'language-' }))
    .use(permalinks({
      pattern: ':collection/:title',
      relative: false,
      slug: {
        lower: true,
        charmap: {
          'Ä': 'ae',
          'Ö': 'oe',
          'Ü': 'ue',
          'ä': 'ae',
          'ö': 'oe',
          'ü': 'ue',
          'ẞ': 'ss'
        }
      }
    }))
    .use(externalCollections({
      'projects': `${process.cwd()}/data/projects.yaml`,
      'talks': `${process.cwd()}/data/talks.yaml`
    }))
    .use(onlyProduction(webmentions({
      domain: 'frederic-hemberger.de',
      token: process.env.WEBMENTION_API_KEY
    })))
    .use(mergeCollections(['articles', 'talks'/*, 'thoughts' */], 'all'))
    .use(onlyProduction(feed({
      collection: 'talks',
      destination: 'feeds/talks.rss'
    })))
    .use(onlyProduction(feed({
      collection: 'all',
      destination: 'feeds/feed.rss',
      preprocess: (itemData) => {
        if (itemData.description) {
          itemData.description = itemData
            .description.toString('utf8')
            .replace(/\/static\//g, 'https://frederic-hemberger.de/static/')
        }

        return itemData
      }
    })))
    // .use(onlyProduction(feed({
    //   collection: 'thoughts',
    //   destination: 'feeds/thoughts.rss'
    // })))
    .use(prism())
    .use(filterStylusPartials())
    .use(stylus({
      compress: true,
      use: [autoprefixer()]
    }))
    .use(onlyProduction(cssnano([
      'static/css/styles.css',
      'static/css/article.css'
    ])))
    .use(discoverPartials({
      directory: 'layouts/partials',
      pattern: /\.hbs$/
    }))
    .use(discoverHelpers({
      directory: 'scripts/helper',
      pattern: /\.js$/
    }))
    .use(layouts())
    .use(onlyProduction(inlineBaseCss()))
    .use(onlyProduction(htmlMinifier()))
    .build((err) => {
      if (err) { throw err }
      console.timeEnd('[metalsmith] Build finished')
    })
}

if (!module.parent) {
  build()
}

module.exports = build
