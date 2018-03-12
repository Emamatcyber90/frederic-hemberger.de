'use strict';

const marked = require('marked');

module.exports = function markdown(config) {
  if (typeof config === 'string') {
    return helper.apply(this, arguments);
  }

  config = config || {};
  if (config.fn || config.hash || arguments.length > 1) {
    return helper.apply(this, arguments);
  }

  function helper(context, options) {
    if (!context) { return; }

    if (typeof context === 'string') {
      var opts = Object.assign({}, config, options);
      return marked(context, opts);
    }

    if (typeof context.fn === 'function') {
      options = context;
      context = {};
    }

    options = Object.assign({ html: true, breaks: true }, config, options);
    options = Object.assign({}, options, options.markdown, options.hash);
    if (options.hasOwnProperty('lang')) {
      options.langPrefix = options.lang;
    }

    var ctx = Object.assign({}, options, this, this.context, context);
    return marked(options.fn(ctx));
  }

  return helper;
};
