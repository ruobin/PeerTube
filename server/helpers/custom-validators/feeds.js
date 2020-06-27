"use strict";
exports.__esModule = true;
var misc_1 = require("./misc");
function isValidRSSFeed(value) {
    if (!misc_1.exists(value))
        return false;
    var feedExtensions = [
        'xml',
        'json',
        'json1',
        'rss',
        'rss2',
        'atom',
        'atom1'
    ];
    return feedExtensions.indexOf(value) !== -1;
}
exports.isValidRSSFeed = isValidRSSFeed;
