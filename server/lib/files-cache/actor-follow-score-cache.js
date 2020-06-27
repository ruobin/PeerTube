"use strict";
exports.__esModule = true;
var constants_1 = require("../../initializers/constants");
var logger_1 = require("../../helpers/logger");
// Cache follows scores, instead of writing them too often in database
// Keep data in memory, we don't really need Redis here as we don't really care to loose some scores
var ActorFollowScoreCache = /** @class */ (function () {
    function ActorFollowScoreCache() {
        this.pendingFollowsScore = {};
        this.pendingBadServer = new Set();
        this.pendingGoodServer = new Set();
    }
    Object.defineProperty(ActorFollowScoreCache, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    ActorFollowScoreCache.prototype.updateActorFollowsScore = function (goodInboxes, badInboxes) {
        if (goodInboxes.length === 0 && badInboxes.length === 0)
            return;
        logger_1.logger.info('Updating %d good actor follows and %d bad actor follows scores in cache.', goodInboxes.length, badInboxes.length);
        for (var _i = 0, goodInboxes_1 = goodInboxes; _i < goodInboxes_1.length; _i++) {
            var goodInbox = goodInboxes_1[_i];
            if (this.pendingFollowsScore[goodInbox] === undefined)
                this.pendingFollowsScore[goodInbox] = 0;
            this.pendingFollowsScore[goodInbox] += constants_1.ACTOR_FOLLOW_SCORE.BONUS;
        }
        for (var _a = 0, badInboxes_1 = badInboxes; _a < badInboxes_1.length; _a++) {
            var badInbox = badInboxes_1[_a];
            if (this.pendingFollowsScore[badInbox] === undefined)
                this.pendingFollowsScore[badInbox] = 0;
            this.pendingFollowsScore[badInbox] += constants_1.ACTOR_FOLLOW_SCORE.PENALTY;
        }
    };
    ActorFollowScoreCache.prototype.addBadServerId = function (serverId) {
        this.pendingBadServer.add(serverId);
    };
    ActorFollowScoreCache.prototype.getBadFollowingServerIds = function () {
        return Array.from(this.pendingBadServer);
    };
    ActorFollowScoreCache.prototype.clearBadFollowingServerIds = function () {
        this.pendingBadServer = new Set();
    };
    ActorFollowScoreCache.prototype.addGoodServerId = function (serverId) {
        this.pendingGoodServer.add(serverId);
    };
    ActorFollowScoreCache.prototype.getGoodFollowingServerIds = function () {
        return Array.from(this.pendingGoodServer);
    };
    ActorFollowScoreCache.prototype.clearGoodFollowingServerIds = function () {
        this.pendingGoodServer = new Set();
    };
    ActorFollowScoreCache.prototype.getPendingFollowsScore = function () {
        return this.pendingFollowsScore;
    };
    ActorFollowScoreCache.prototype.clearPendingFollowsScore = function () {
        this.pendingFollowsScore = {};
    };
    return ActorFollowScoreCache;
}());
exports.ActorFollowScoreCache = ActorFollowScoreCache;
