'use strict'

const url = require('url')
const fetch = require('node-fetch')

module.exports = function webmentions (options) {
  options = options || {}

  if (!options.domain) {
    console.error('webmention.io: Domain name required')
    process.exit(1)
  }

  if (!options.token) {
    console.error('webmention.io: API token required')
    process.exit(1)
  }

  return async function (files, metalsmith, done) {
    let metadata = metalsmith.metadata()

    console.log(`[metalsmith] Loading webmentions: https://webmention.io/api/mentions?per-page=${Number.MAX_SAFE_INTEGER}&domain=${options.domain}&token=**********`)
    const res = await fetch(`https://webmention.io/api/mentions?per-page=${Number.MAX_SAFE_INTEGER}&domain=${options.domain}&token=${options.token}`)
    const json = await res.json()

    // Sort webmentions by date (descending), then split them by URL and activity type
    const bucket = {}
    json.links
      .sort((a, b) => new Date(a.data.published) - new Date(b.data.published))
      .forEach(webmention => {
        const path = url.parse(webmention.target).pathname
        bucket[path] = bucket[path] || {}
        bucket[path][webmention.activity.type] = bucket[path][webmention.activity.type] || []
        bucket[path][webmention.activity.type].push(webmention.data)
      })

    // Attach webmentions to matching article
    metadata.articles = metadata.articles.map(article => {
      const path = `/${article.path}/`
      if (bucket[path]) {
        article.webmentions = bucket[path]
      }
      return article
    })

    done()
  }
}
