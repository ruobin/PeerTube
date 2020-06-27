"use strict";
exports.__esModule = true;
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
exports.randomInt = randomInt;
// Thanks https://stackoverflow.com/a/16187766
function compareSemVer(a, b) {
    var regExStrip0 = /(\.0+)+$/;
    var segmentsA = a.replace(regExStrip0, '').split('.');
    var segmentsB = b.replace(regExStrip0, '').split('.');
    var l = Math.min(segmentsA.length, segmentsB.length);
    for (var i = 0; i < l; i++) {
        var diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff)
            return diff;
    }
    return segmentsA.length - segmentsB.length;
}
exports.compareSemVer = compareSemVer;
function isPromise(value) {
    return value && typeof value.then === 'function';
}
exports.isPromise = isPromise;
function isCatchable(value) {
    return value && typeof value["catch"] === 'function';
}
exports.isCatchable = isCatchable;
