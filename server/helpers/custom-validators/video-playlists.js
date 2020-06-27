"use strict";
exports.__esModule = true;
var misc_1 = require("./misc");
var validator = require("validator");
var constants_1 = require("../../initializers/constants");
var PLAYLISTS_CONSTRAINT_FIELDS = constants_1.CONSTRAINTS_FIELDS.VIDEO_PLAYLISTS;
function isVideoPlaylistNameValid(value) {
    return misc_1.exists(value) && validator.isLength(value, PLAYLISTS_CONSTRAINT_FIELDS.NAME);
}
exports.isVideoPlaylistNameValid = isVideoPlaylistNameValid;
function isVideoPlaylistDescriptionValid(value) {
    return value === null || (misc_1.exists(value) && validator.isLength(value, PLAYLISTS_CONSTRAINT_FIELDS.DESCRIPTION));
}
exports.isVideoPlaylistDescriptionValid = isVideoPlaylistDescriptionValid;
function isVideoPlaylistPrivacyValid(value) {
    return validator.isInt(value + '') && constants_1.VIDEO_PLAYLIST_PRIVACIES[value] !== undefined;
}
exports.isVideoPlaylistPrivacyValid = isVideoPlaylistPrivacyValid;
function isVideoPlaylistTimestampValid(value) {
    return value === null || (misc_1.exists(value) && validator.isInt('' + value, { min: 0 }));
}
exports.isVideoPlaylistTimestampValid = isVideoPlaylistTimestampValid;
function isVideoPlaylistTypeValid(value) {
    return misc_1.exists(value) && constants_1.VIDEO_PLAYLIST_TYPES[value] !== undefined;
}
exports.isVideoPlaylistTypeValid = isVideoPlaylistTypeValid;
