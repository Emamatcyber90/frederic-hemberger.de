#!/usr/bin/env node
'use strict'

const Path = require('path')
const Http = require('http')
const st = require('st')
const Chokidar = require('chokidar')

const build = require('./build.js')

function serve () {
  const mount = st({
    path: Path.join(process.cwd(), 'build'),
    cache: false,
    index: 'index.html'
  })

  Http
    .createServer((req, res) => mount(req, res))
    .listen(8080, () => console.log('[metalsmith] Server runs at http://localhost:8080/'))

  /** File Watches for Re-Builds **/
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
  }

  const change = (path) => {
    const relativePath = path.replace(`${process.cwd()}/`, '')
    console.log(`[metalsmith] File ${relativePath} was changed. Rebuilding ...`)
    build()
  };

  ['src', 'layouts', 'data']
    .map((dir) => Chokidar.watch(Path.join(process.cwd(), dir), opts))
    .forEach((watched) => {
      watched.on('change', change)
      watched.on('add', change)
    })
}

build()
serve()
