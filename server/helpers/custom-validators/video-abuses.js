"use strict";
exports.__esModule = true;
var validator = require("validator");
var constants_1 = require("../../initializers/constants");
var misc_1 = require("./misc");
var VIDEO_ABUSES_CONSTRAINTS_FIELDS = constants_1.CONSTRAINTS_FIELDS.VIDEO_ABUSES;
function isVideoAbuseReasonValid(value) {
    return misc_1.exists(value) && validator.isLength(value, VIDEO_ABUSES_CONSTRAINTS_FIELDS.REASON);
}
exports.isVideoAbuseReasonValid = isVideoAbuseReasonValid;
function isVideoAbuseModerationCommentValid(value) {
    return misc_1.exists(value) && validator.isLength(value, VIDEO_ABUSES_CONSTRAINTS_FIELDS.MODERATION_COMMENT);
}
exports.isVideoAbuseModerationCommentValid = isVideoAbuseModerationCommentValid;
function isVideoAbuseStateValid(value) {
    return misc_1.exists(value) && constants_1.VIDEO_ABUSE_STATES[value] !== undefined;
}
exports.isVideoAbuseStateValid = isVideoAbuseStateValid;
