"use strict";
exports.__esModule = true;
var validator = require("validator");
var constants_1 = require("../../../initializers/constants");
var core_utils_1 = require("../../core-utils");
var misc_1 = require("../misc");
var videos_1 = require("../videos");
var misc_2 = require("./misc");
var videos_2 = require("../../../../shared/models/videos");
function sanitizeAndCheckVideoTorrentUpdateActivity(activity) {
    return misc_2.isBaseActivityValid(activity, 'Update') &&
        sanitizeAndCheckVideoTorrentObject(activity.object);
}
exports.sanitizeAndCheckVideoTorrentUpdateActivity = sanitizeAndCheckVideoTorrentUpdateActivity;
function isActivityPubVideoDurationValid(value) {
    // https://www.w3.org/TR/activitystreams-vocabulary/#dfn-duration
    return misc_1.exists(value) &&
        typeof value === 'string' &&
        value.startsWith('PT') &&
        value.endsWith('S') &&
        videos_1.isVideoDurationValid(value.replace(/[^0-9]+/g, ''));
}
function sanitizeAndCheckVideoTorrentObject(video) {
    if (!video || video.type !== 'Video')
        return false;
    if (!setValidRemoteTags(video))
        return false;
    if (!setValidRemoteVideoUrls(video))
        return false;
    if (!setRemoteVideoTruncatedContent(video))
        return false;
    if (!misc_2.setValidAttributedTo(video))
        return false;
    if (!setValidRemoteCaptions(video))
        return false;
    // Default attributes
    if (!videos_1.isVideoStateValid(video.state))
        video.state = videos_2.VideoState.PUBLISHED;
    if (!misc_1.isBooleanValid(video.waitTranscoding))
        video.waitTranscoding = false;
    if (!misc_1.isBooleanValid(video.downloadEnabled))
        video.downloadEnabled = true;
    return misc_2.isActivityPubUrlValid(video.id) &&
        videos_1.isVideoNameValid(video.name) &&
        isActivityPubVideoDurationValid(video.duration) &&
        misc_1.isUUIDValid(video.uuid) &&
        (!video.category || isRemoteNumberIdentifierValid(video.category)) &&
        (!video.licence || isRemoteNumberIdentifierValid(video.licence)) &&
        (!video.language || isRemoteStringIdentifierValid(video.language)) &&
        videos_1.isVideoViewsValid(video.views) &&
        misc_1.isBooleanValid(video.sensitive) &&
        misc_1.isBooleanValid(video.commentsEnabled) &&
        misc_1.isBooleanValid(video.downloadEnabled) &&
        misc_1.isDateValid(video.published) &&
        misc_1.isDateValid(video.updated) &&
        (!video.originallyPublishedAt || misc_1.isDateValid(video.originallyPublishedAt)) &&
        (!video.content || isRemoteVideoContentValid(video.mediaType, video.content)) &&
        isRemoteVideoIconValid(video.icon) &&
        video.url.length !== 0 &&
        video.attributedTo.length !== 0;
}
exports.sanitizeAndCheckVideoTorrentObject = sanitizeAndCheckVideoTorrentObject;
function isRemoteVideoUrlValid(url) {
    // FIXME: Old bug, we used the width to represent the resolution. Remove it in a few release (currently beta.11)
    if (url.width && !url.height)
        url.height = url.width;
    return url.type === 'Link' &&
        (
        // TODO: remove mimeType (backward compatibility, introduced in v1.1.0)
        constants_1.ACTIVITY_PUB.URL_MIME_TYPES.VIDEO.indexOf(url.mediaType || url.mimeType) !== -1 &&
            misc_2.isActivityPubUrlValid(url.href) &&
            validator.isInt(url.height + '', { min: 0 }) &&
            validator.isInt(url.size + '', { min: 0 }) &&
            (!url.fps || validator.isInt(url.fps + '', { min: -1 }))) ||
        (constants_1.ACTIVITY_PUB.URL_MIME_TYPES.TORRENT.indexOf(url.mediaType || url.mimeType) !== -1 &&
            misc_2.isActivityPubUrlValid(url.href) &&
            validator.isInt(url.height + '', { min: 0 })) ||
        (constants_1.ACTIVITY_PUB.URL_MIME_TYPES.MAGNET.indexOf(url.mediaType || url.mimeType) !== -1 &&
            validator.isLength(url.href, { min: 5 }) &&
            validator.isInt(url.height + '', { min: 0 })) ||
        ((url.mediaType || url.mimeType) === 'application/x-mpegURL' &&
            misc_2.isActivityPubUrlValid(url.href) &&
            misc_1.isArray(url.tag));
}
exports.isRemoteVideoUrlValid = isRemoteVideoUrlValid;
// ---------------------------------------------------------------------------
function setValidRemoteTags(video) {
    if (Array.isArray(video.tag) === false)
        return false;
    video.tag = video.tag.filter(function (t) {
        return t.type === 'Hashtag' &&
            videos_1.isVideoTagValid(t.name);
    });
    return true;
}
function setValidRemoteCaptions(video) {
    if (!video.subtitleLanguage)
        video.subtitleLanguage = [];
    if (Array.isArray(video.subtitleLanguage) === false)
        return false;
    video.subtitleLanguage = video.subtitleLanguage.filter(function (caption) {
        return isRemoteStringIdentifierValid(caption);
    });
    return true;
}
function isRemoteNumberIdentifierValid(data) {
    return validator.isInt(data.identifier, { min: 0 });
}
function isRemoteStringIdentifierValid(data) {
    return typeof data.identifier === 'string';
}
exports.isRemoteStringIdentifierValid = isRemoteStringIdentifierValid;
function isRemoteVideoContentValid(mediaType, content) {
    return mediaType === 'text/markdown' && videos_1.isVideoTruncatedDescriptionValid(content);
}
function isRemoteVideoIconValid(icon) {
    return icon.type === 'Image' &&
        misc_2.isActivityPubUrlValid(icon.url) &&
        icon.mediaType === 'image/jpeg' &&
        validator.isInt(icon.width + '', { min: 0 }) &&
        validator.isInt(icon.height + '', { min: 0 });
}
function setValidRemoteVideoUrls(video) {
    if (Array.isArray(video.url) === false)
        return false;
    video.url = video.url.filter(function (u) { return isRemoteVideoUrlValid(u); });
    return true;
}
function setRemoteVideoTruncatedContent(video) {
    if (video.content) {
        video.content = core_utils_1.peertubeTruncate(video.content, constants_1.CONSTRAINTS_FIELDS.VIDEOS.TRUNCATED_DESCRIPTION.max);
    }
    return true;
}
