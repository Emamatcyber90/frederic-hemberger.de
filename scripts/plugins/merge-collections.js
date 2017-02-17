'use strict';

module.exports = function mergeCollections (sources, destination) {

    if (!Array.isArray(sources)) { sources = [sources]; }

    return function (files, metalsmith, done) {

        const metadata = metalsmith.metadata();
        metadata.collections[destination] = sources
            .map((source) => metadata.collections[source])
            .filter((source) => source)
            .reduce((previousValue, currentValue) => previousValue.concat(currentValue))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        done();
    };
};
