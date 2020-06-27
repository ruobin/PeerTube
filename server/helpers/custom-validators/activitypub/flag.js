"use strict";
exports.__esModule = true;
var misc_1 = require("./misc");
var video_abuses_1 = require("../video-abuses");
function isFlagActivityValid(activity) {
    return activity.type === 'Flag' &&
        video_abuses_1.isVideoAbuseReasonValid(activity.content) &&
        misc_1.isActivityPubUrlValid(activity.object);
}
exports.isFlagActivityValid = isFlagActivityValid;
