'use strict'

const fetch = require('node-fetch')

module.exports = function webmentions (options) {
  options = options || {}

  if (!options.domain) {
    throw new TypeError('webmention.io: Domain name required')
  }

  if (!options.token) {
    throw new TypeError('webmention.io: API token required')
  }

  return async function (files, metalsmith, done) {
    let metadata = metalsmith.metadata()

    console.log(`[metalsmith] Loading webmentions for ${options.domain}`)
    const res = await fetch(`https://webmention.io/api/mentions?sort-by=published&sort-dir=up&per-page=${Number.MAX_SAFE_INTEGER}&domain=${options.domain}&token=${options.token}`)
    const json = await res.json()

    // Split webmentions by URL and activity type
    const bucket = {}
    json.links
      .forEach(webmention => {
        const path = (new URL(webmention.target)).pathname
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
