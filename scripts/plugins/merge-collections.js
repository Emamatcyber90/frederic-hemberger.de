'use strict';


module.exports = function mergeCollections (sources, destination) {

    if (!Array.isArray(sources)) { sources = [sources]; }

    return function (files, metalsmith, done) {

        let metadata = metalsmith.metadata();
        metadata.collections[destination] = sources
            .map(function (source) { return metadata.collections[source]; })
            .filter(function (source) { return source; })
            .reduce(function (previousValue, currentValue) { return previousValue.concat(currentValue); })
            .sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        done();
    };
};
