"use strict";
exports.__esModule = true;
var validator = require("validator");
var constants_1 = require("../../../initializers/constants");
var misc_1 = require("../misc");
var misc_2 = require("./misc");
function sanitizeAndCheckVideoCommentObject(comment) {
    if (!comment || comment.type !== 'Note')
        return false;
    normalizeComment(comment);
    return misc_2.isActivityPubUrlValid(comment.id) &&
        isCommentContentValid(comment.content) &&
        misc_2.isActivityPubUrlValid(comment.inReplyTo) &&
        misc_1.isDateValid(comment.published) &&
        misc_2.isActivityPubUrlValid(comment.url) &&
        misc_1.isArray(comment.to) &&
        (comment.to.indexOf(constants_1.ACTIVITY_PUB.PUBLIC) !== -1 ||
            comment.cc.indexOf(constants_1.ACTIVITY_PUB.PUBLIC) !== -1); // Only accept public comments
}
exports.sanitizeAndCheckVideoCommentObject = sanitizeAndCheckVideoCommentObject;
// ---------------------------------------------------------------------------
function isCommentContentValid(content) {
    return misc_1.exists(content) && validator.isLength('' + content, { min: 1 });
}
function normalizeComment(comment) {
    if (!comment)
        return;
    if (typeof comment.url !== 'string') {
        if (typeof comment.url === 'object')
            comment.url = comment.url.href || comment.url.url;
        else
            comment.url = comment.id;
    }
    return;
}
