#!/usr/bin/env node
'use strict';

const Path = require('path');
const Metalsmith = require('metalsmith');

const autoprefixer = require('autoprefixer-stylus');
const brotli = require('metalsmith-brotli');
const collections = require('metalsmith-collections');
const feed = require('metalsmith-feed');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const prism = require('metalsmith-prism');
const permalinks = require('metalsmith-permalinks');
const stylus = require('metalsmith-stylus');

// Custome metalsmith plugins
const cssnano = require('./plugins/cssnano.js');
const externalCollections = require('./plugins/external-collections.js');
const filterStylusPartials = require('./plugins/filter-stylus-partials.js');
const inlineBaseCss = require('./plugins/inline-base-css.js');
const mergeCollections = require('./plugins/merge-collections.js');


function build () {

    console.time('[metalsmith] Build finished');
    Metalsmith(process.cwd())
        .metadata({
            site: {
                title  : 'Frederic Hemberger',
                author : 'Frederic Hemberger',
                url    : 'https://frederic-hemberger.de'
            }
        })
        .use(collections({
            articles : { pattern: 'articles/*.md', refer: false, sortby: 'date', reverse: true },
            thoughts : { pattern: 'thoughts/*.md', refer: false, sortby: 'date', reverse: true }
        }))
        .use(markdown({ langPrefix: 'language-' }))
        .use(permalinks({
            pattern: ':collection/:title',
            relative: false,
            slug: {
                lower: true,
                charmap: {
                    'Ä': 'ae', 'Ö': 'oe', 'Ü': 'ue',
                    'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ẞ': 'ss'
                }
            }
        }))
        .use(externalCollections({
            'articles_external' : `${process.cwd()}/data/articles_external.yaml`,
            'podcasts'          : `${process.cwd()}/data/podcasts.yaml`,
            'talks'             : `${process.cwd()}/data/talks.yaml`
        }))
        .use(mergeCollections(['articles', 'articles_external'], 'articles'))
        .use(mergeCollections(['articles', 'podcasts', 'talks', 'thoughts'], 'all'))
        .use(feed({
            collection: 'talks',
            destination: 'feeds/talks.rss'
        }))
        .use(feed({
            collection: 'all',
            destination: 'feeds/feed.rss',
            preprocess: (itemData) => {

                // Decode HTML entities in "title"
                itemData.title = itemData.title.replace(/&lt;head&gt;/, '»head«');

                if (itemData.description) {
                    itemData.description = itemData.description.toString('utf8')
                        .replace(/\/static\//g, 'https://frederic-hemberger.de/static/')
                }

                return itemData;
            }
        }))
        // .use(feed({
        //   collection: 'thoughts',
        //   destination: 'feeds/thoughts.rss'
        // }))
        .use(prism())
        .use(filterStylusPartials())
        .use(stylus({
            compress: true,
            use: [autoprefixer()]
        }))
        .use(cssnano([
            'static/css/styles.css',
            'static/css/article.css'
        ]))
        .use(layouts({
            engine: 'handlebars',
            partials: 'layouts/partials',
            helpers: {
                markdown   : require('./helper/markdown.js'),
                startswith : require('./helper/startswith.js'),
                strftime   : require('./helper/strftime.js'),
                equals     : require('./helper/equals.js')
            }
        }))
        .use(inlineBaseCss())
        .use(brotli())
        .build((err) => {

            if (err) { throw err; }
            console.timeEnd('[metalsmith] Build finished');
        });
}


if (!module.parent) {
    return build();
}

module.exports = build;
