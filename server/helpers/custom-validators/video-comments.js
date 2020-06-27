"use strict";
exports.__esModule = true;
require("multer");
var validator = require("validator");
var constants_1 = require("../../initializers/constants");
var VIDEO_COMMENTS_CONSTRAINTS_FIELDS = constants_1.CONSTRAINTS_FIELDS.VIDEO_COMMENTS;
function isValidVideoCommentText(value) {
    return value === null || validator.isLength(value, VIDEO_COMMENTS_CONSTRAINTS_FIELDS.TEXT);
}
exports.isValidVideoCommentText = isValidVideoCommentText;
