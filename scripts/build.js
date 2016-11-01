#!/usr/bin/env node
'use strict';

const Path = require('path');
const Metalsmith = require('metalsmith');

const autoprefixer = require('autoprefixer-stylus');
const collections = require('metalsmith-collections');
const feed = require('metalsmith-feed');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const prism = require('metalsmith-prism');
const permalinks = require('metalsmith-permalinks');
const stylus = require('metalsmith-stylus');

// Custome metalsmith plugins
const externalCollections = require('./plugins/external-collections.js');
const mergeCollections = require('./plugins/merge-collections.js');
const filterStylusPartials = require('./plugins/filter-stylus-partials.js');
const cssshrink = require('./plugins/cssshrink.js');

// Handlebars helpers
const startswith = require('./helper/startswith.js');
const strftime = require('./helper/strftime.js');
const equals = require('./helper/equals.js');


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
        .use(prism())
        .use(filterStylusPartials())
        .use(stylus({
            compress: true,
            use: [autoprefixer()]
        }))
        .use(cssshrink([
            'static/css/styles.css',
            'static/css/article.css'
        ]))
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
        .use(mergeCollections(['articles', 'articles_external', 'podcasts', 'talks', 'thoughts'], 'all'))
        .use(feed({
            collection: 'talks',
            destination: 'feeds/talks.rss'
        }))
        .use(feed({
            collection: 'all',
            destination: 'feeds/feed.rss'
        }))
        // .use(feed({
        //   collection: 'thoughts',
        //   destination: 'feeds/thoughts.rss'
        // }))
        .use(layouts({
            engine: 'handlebars',
            partials: 'layouts/partials',
            helpers: {
                startswith,
                strftime,
                equals
            }
        }))
        .build((err) => {

            if (err) { throw err; }
            console.timeEnd('[metalsmith] Build finished');
        });
}


if (!module.parent) {
    return build();
}

module.exports = build;
