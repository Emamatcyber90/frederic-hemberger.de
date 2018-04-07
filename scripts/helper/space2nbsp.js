'use strict'

// Replace all line breaks followed by spaces with the same number of &nbsp;
module.exports = function (content) {
  const spaces = [...new Set(content.match(/\n +/g))].sort((a,b) => b.length - a.length)
  spaces.forEach(match =>
    content = content.replace(new RegExp(match, 'g'), '\n' + '&nbsp;'.repeat(match.length - 1))
  )
  return content
}
