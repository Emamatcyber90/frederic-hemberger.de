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

const site = {
  title: 'Frederic Hemberger',
  author: 'Frederic Hemberger',
  description: 'Freelance web developer and consultant from Cologne, Germany.',
  url: 'https://frederic-hemberger.de'
}

function build () {
  console.time('[metalsmith] Build finished')
  Metalsmith(process.cwd())
    .metadata({ site })
    .use(collections({
      articles: { pattern: 'articles/*.md', refer: false, sortby: 'date', reverse: true }
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
    .use(mergeCollections(['articles', 'talks'], 'feed'))
    .use(onlyProduction(feed({
      collection: 'feed',
      destination: 'feed/index.xml',
      // Not a valid RSS <channel> item
      author: null,
      description: site.description,
      preprocess: (itemData) => {
        let title = itemData.title
        let description = itemData.description

        if (itemData.collection.includes('talks')) {
          title = `Talk: ${title}`
        }

        if (itemData.collection.includes('articles')) {
          title = `Article: ${title}`
        }

        if (description) {
          description = description
            .toString('utf8')
            .replace(/(\/static\/)/g, `${site.url} $1`)
        }

        return {
          title: title,
          description: description || itemData.intro,
          url: itemData.url,
          categories: itemData.collection,
          author: site.author,
          date: itemData.date
        }
      }
    })))
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
      if (err) {
        console.error('[metalsmith] Build error:\n')
        console.error(err.stack)
        process.exit(1)
      }
      console.timeEnd('[metalsmith] Build finished')
    })
}

// @ts-ignore
if (!module.parent) {
  build()
}

module.exports = build
