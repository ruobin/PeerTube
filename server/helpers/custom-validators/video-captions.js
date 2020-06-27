"use strict";
exports.__esModule = true;
var constants_1 = require("../../initializers/constants");
var misc_1 = require("./misc");
function isVideoCaptionLanguageValid(value) {
    return misc_1.exists(value) && constants_1.VIDEO_LANGUAGES[value] !== undefined;
}
exports.isVideoCaptionLanguageValid = isVideoCaptionLanguageValid;
var videoCaptionTypes = Object.keys(constants_1.MIMETYPES.VIDEO_CAPTIONS.MIMETYPE_EXT)
    .concat(['application/octet-stream']) // MacOS sends application/octet-stream ><
    .map(function (m) { return "(" + m + ")"; });
var videoCaptionTypesRegex = videoCaptionTypes.join('|');
function isVideoCaptionFile(files, field) {
    return misc_1.isFileValid(files, videoCaptionTypesRegex, field, constants_1.CONSTRAINTS_FIELDS.VIDEO_CAPTIONS.CAPTION_FILE.FILE_SIZE.max);
}
exports.isVideoCaptionFile = isVideoCaptionFile;
