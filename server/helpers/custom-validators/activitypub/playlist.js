"use strict";
exports.__esModule = true;
var misc_1 = require("../misc");
var validator = require("validator");
var misc_2 = require("./misc");
function isPlaylistObjectValid(object) {
    return misc_1.exists(object) &&
        object.type === 'Playlist' &&
        validator.isInt(object.totalItems + '') &&
        misc_1.isDateValid(object.published) &&
        misc_1.isDateValid(object.updated);
}
exports.isPlaylistObjectValid = isPlaylistObjectValid;
function isPlaylistElementObjectValid(object) {
    return misc_1.exists(object) &&
        object.type === 'PlaylistElement' &&
        validator.isInt(object.position + '') &&
        misc_2.isActivityPubUrlValid(object.url);
}
exports.isPlaylistElementObjectValid = isPlaylistElementObjectValid;
