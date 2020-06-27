"use strict";
exports.__esModule = true;
var validator = require("validator");
var misc_1 = require("./misc");
var constants_1 = require("../../initializers/constants");
var videos_1 = require("../../../shared/models/videos");
var VIDEO_BLACKLIST_CONSTRAINTS_FIELDS = constants_1.CONSTRAINTS_FIELDS.VIDEO_BLACKLIST;
function isVideoBlacklistReasonValid(value) {
    return value === null || validator.isLength(value, VIDEO_BLACKLIST_CONSTRAINTS_FIELDS.REASON);
}
exports.isVideoBlacklistReasonValid = isVideoBlacklistReasonValid;
function isVideoBlacklistTypeValid(value) {
    return misc_1.exists(value) && validator.isInt('' + value) && videos_1.VideoBlacklistType[value] !== undefined;
}
exports.isVideoBlacklistTypeValid = isVideoBlacklistTypeValid;
