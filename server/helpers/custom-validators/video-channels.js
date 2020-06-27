"use strict";
exports.__esModule = true;
var validator = require("validator");
var constants_1 = require("../../initializers/constants");
var misc_1 = require("./misc");
var VIDEO_CHANNELS_CONSTRAINTS_FIELDS = constants_1.CONSTRAINTS_FIELDS.VIDEO_CHANNELS;
function isVideoChannelDescriptionValid(value) {
    return value === null || validator.isLength(value, VIDEO_CHANNELS_CONSTRAINTS_FIELDS.DESCRIPTION);
}
exports.isVideoChannelDescriptionValid = isVideoChannelDescriptionValid;
function isVideoChannelNameValid(value) {
    return misc_1.exists(value) && validator.isLength(value, VIDEO_CHANNELS_CONSTRAINTS_FIELDS.NAME);
}
exports.isVideoChannelNameValid = isVideoChannelNameValid;
function isVideoChannelSupportValid(value) {
    return value === null || (misc_1.exists(value) && validator.isLength(value, VIDEO_CHANNELS_CONSTRAINTS_FIELDS.SUPPORT));
}
exports.isVideoChannelSupportValid = isVideoChannelSupportValid;
