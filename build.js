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


// Own metalsmith plugins
const externalCollections = require('./scripts/plugins/external-collections.js');
const mergeCollections = require('./scripts/plugins/merge-collections.js');
const filterStylusPartials = require('./scripts/plugins/filter-stylus-partials.js');
const cssshrink = require('./scripts/plugins/cssshrink.js');

// Handlebars helpers
const startswith = require('./scripts/helper/startswith.js');
const strftime = require('./scripts/helper/strftime.js');
const equals = require('./scripts/helper/equals.js');


/**
 * Build.
 */
function build () {

    console.time('[metalsmith] Build finished');
    Metalsmith(__dirname)
        .metadata({
            site: {
                title  : 'Frederic Hemberger',
                author : 'Frederic Hemberger',
                url    : 'http://frederic-hemberger.de'
            }
        })
        .use(collections({
            artikel  : { pattern: 'artikel/*.md', refer: false },
            articles : { pattern: 'articles/*.md', refer: false },
            notes    : { pattern: 'notes/*.md', refer: false }
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
            externalArticles : `${__dirname}/data/external_articles.yaml`,
            podcasts         : `${__dirname}/data/podcasts.yaml`,
            talks            : `${__dirname}/data/talks.yaml`
        }))
        .use(mergeCollections(['artikel', 'articles', 'externalArticles'], 'articles'))
        .use(mergeCollections(['artikel', 'articles', 'podcasts', 'talks'], 'all'))
        .use(feed({
            collection: 'talks',
            destination: 'feeds/talks.rss'
        }))
        .use(feed({
            collection: 'all',
            destination: 'feeds/feed.rss'
        }))
        // .use(feed({
        //   collection: 'notes',
        //   destination: 'feeds/notes.rss'
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
        .build(function (err) {

            if (err) { throw err; }
            console.timeEnd('[metalsmith] Build finished');
        });
}


function server () {
    const Http = require('http');
    const st = require('st');
    const mount = st({
        path: Path.join(__dirname, 'build'),
        cache: false,
        index: 'index.html'
    });
    Http
        .createServer(function (req, res) { mount(req, res); })
        .listen(8080, function () { console.log('[metalsmith] Server runs at http://localhost:8080/'); });

    /** File Watches for Re-Builds **/
    const Chokidar = require('chokidar');
    const opts = {
        persistent: true,
        ignoreInitial: true,
        followSymlinks: true,
        usePolling: true,
        alwaysStat: false,
        depth: undefined,
        interval: 100,
        ignorePermissionErrors: false,
        atomic: true
    };
    const source  = Chokidar.watch(Path.join(__dirname, 'src'), opts);
    const layouts = Chokidar.watch(Path.join(__dirname, 'layouts'), opts);
    const data    = Chokidar.watch(Path.join(__dirname, 'data'), opts);

    const add = function (path) {

        const relativePath = path.replace(`${__dirname}/`, '');
        console.log(`[metalsmith] File ${relativePath} was added. Rebuilding ...`);
        build();
    };

    const change = function (path) {

        const relativePath = path.replace(`${__dirname}/`, '');
        console.log(`[metalsmith] File ${relativePath} was changed. Rebuilding ...`);
        build();
    };

    source.on('change', change);
    source.on('add', add);
    layouts.on('change', change);
    layouts.on('add', add);
    data.on('change', change);
    data.on('add', add);
}


build();
if (process.argv[2] === 'serve') {
    server();
}



/*
Custom attributes for feed:
title string Title of your site or feed
description optional string A short description of the feed.
generator optional string Feed generator.
feed_url url string Url to the rss feed.
site_url url string Url to the site that the feed is for.
image_url optional *url string Small image for feed readers to use.
docs optional url string Url to documentation on this feed.
managingEditor optional string Who manages content in this feed.
webMaster optional string Who manages feed availability and technical support.
copyright optional string Copyright information for this feed.
language optional string The language of the content of this feed.
categories optional array of strings One or more categories this feed belongs to.
pubDate optional Date object or date string The publication date for content in the feed
ttl optional integer Number of minutes feed can be cached before refreshing from source.
hub optional PubSubHubbub hub url Where is the PubSubHub hub located.
custom_namespaces optional object Put additional namespaces in element (without 'xmlns:' prefix)
custom_elements optional array Put additional elements in the feed (node-xml syntax)
 */

