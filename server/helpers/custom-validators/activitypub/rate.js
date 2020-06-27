"use strict";
exports.__esModule = true;
var misc_1 = require("./misc");
function isDislikeActivityValid(activity) {
    return activity.type === 'Dislike' &&
        misc_1.isActivityPubUrlValid(activity.actor) &&
        misc_1.isObjectValid(activity.object);
}
exports.isDislikeActivityValid = isDislikeActivityValid;
