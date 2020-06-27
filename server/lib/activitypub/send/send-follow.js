"use strict";
exports.__esModule = true;
var url_1 = require("../url");
var utils_1 = require("./utils");
var logger_1 = require("../../../helpers/logger");
function sendFollow(actorFollow, t) {
    var me = actorFollow.ActorFollower;
    var following = actorFollow.ActorFollowing;
    // Same server as ours
    if (!following.serverId)
        return;
    logger_1.logger.info('Creating job to send follow request to %s.', following.url);
    var url = url_1.getActorFollowActivityPubUrl(me, following);
    var data = buildFollowActivity(url, me, following);
    t.afterCommit(function () { return utils_1.unicastTo(data, me, following.inboxUrl); });
}
exports.sendFollow = sendFollow;
function buildFollowActivity(url, byActor, targetActor) {
    return {
        type: 'Follow',
        id: url,
        actor: byActor.url,
        object: targetActor.url
    };
}
exports.buildFollowActivity = buildFollowActivity;
