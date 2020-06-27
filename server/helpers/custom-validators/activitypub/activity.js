"use strict";
exports.__esModule = true;
var validator = require("validator");
var actor_1 = require("./actor");
var misc_1 = require("./misc");
var rate_1 = require("./rate");
var video_comments_1 = require("./video-comments");
var videos_1 = require("./videos");
var view_1 = require("./view");
var misc_2 = require("../misc");
var cache_file_1 = require("./cache-file");
var flag_1 = require("./flag");
var playlist_1 = require("./playlist");
function isRootActivityValid(activity) {
    return isCollection(activity) || isActivity(activity);
}
exports.isRootActivityValid = isRootActivityValid;
function isCollection(activity) {
    return (activity.type === 'Collection' || activity.type === 'OrderedCollection') &&
        validator.isInt(activity.totalItems, { min: 0 }) &&
        Array.isArray(activity.items);
}
function isActivity(activity) {
    return misc_1.isActivityPubUrlValid(activity.id) &&
        misc_2.exists(activity.actor) &&
        (misc_1.isActivityPubUrlValid(activity.actor) || misc_1.isActivityPubUrlValid(activity.actor.id));
}
var activityCheckers = {
    Create: checkCreateActivity,
    Update: checkUpdateActivity,
    Delete: checkDeleteActivity,
    Follow: checkFollowActivity,
    Accept: checkAcceptActivity,
    Reject: checkRejectActivity,
    Announce: checkAnnounceActivity,
    Undo: checkUndoActivity,
    Like: checkLikeActivity,
    View: checkViewActivity,
    Flag: checkFlagActivity,
    Dislike: checkDislikeActivity
};
function isActivityValid(activity) {
    var checker = activityCheckers[activity.type];
    // Unknown activity type
    if (!checker)
        return false;
    return checker(activity);
}
exports.isActivityValid = isActivityValid;
// ---------------------------------------------------------------------------
function checkViewActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'View') &&
        view_1.isViewActivityValid(activity);
}
function checkFlagActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Flag') &&
        flag_1.isFlagActivityValid(activity);
}
function checkDislikeActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Dislike') &&
        rate_1.isDislikeActivityValid(activity);
}
function checkCreateActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Create') &&
        (view_1.isViewActivityValid(activity.object) ||
            rate_1.isDislikeActivityValid(activity.object) ||
            flag_1.isFlagActivityValid(activity.object) ||
            playlist_1.isPlaylistObjectValid(activity.object) ||
            cache_file_1.isCacheFileObjectValid(activity.object) ||
            video_comments_1.sanitizeAndCheckVideoCommentObject(activity.object) ||
            videos_1.sanitizeAndCheckVideoTorrentObject(activity.object));
}
function checkUpdateActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Update') &&
        (cache_file_1.isCacheFileObjectValid(activity.object) ||
            playlist_1.isPlaylistObjectValid(activity.object) ||
            videos_1.sanitizeAndCheckVideoTorrentObject(activity.object) ||
            actor_1.sanitizeAndCheckActorObject(activity.object));
}
function checkDeleteActivity(activity) {
    // We don't really check objects
    return misc_1.isBaseActivityValid(activity, 'Delete') &&
        misc_1.isObjectValid(activity.object);
}
function checkFollowActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Follow') &&
        misc_1.isObjectValid(activity.object);
}
function checkAcceptActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Accept');
}
function checkRejectActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Reject');
}
function checkAnnounceActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Announce') &&
        misc_1.isObjectValid(activity.object);
}
function checkUndoActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Undo') &&
        (checkFollowActivity(activity.object) ||
            checkLikeActivity(activity.object) ||
            checkDislikeActivity(activity.object) ||
            checkAnnounceActivity(activity.object) ||
            checkCreateActivity(activity.object));
}
function checkLikeActivity(activity) {
    return misc_1.isBaseActivityValid(activity, 'Like') &&
        misc_1.isObjectValid(activity.object);
}
