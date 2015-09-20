'use strict';

const CssShrink = require('cssshrink');


module.exports = function filterStylusPartials (cssFiles) {

    return function (files, metalsmith, done) {

        cssFiles.forEach(function (filename) {
            console.log('[metalsmith] Shrinking CSS file', filename);
            try {
                const shrunk = CssShrink.shrink(files[filename].contents.toString());
                files[filename].contents = new Buffer(shrunk);
            } catch(e) {
                console.error('[metalsmith] Error shrinking file %s: %s', filename, e);
            }
        });

        done();
    };
};
