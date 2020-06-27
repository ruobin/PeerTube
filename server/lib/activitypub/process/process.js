"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var activitypub_1 = require("../../../helpers/activitypub");
var logger_1 = require("../../../helpers/logger");
var process_accept_1 = require("./process-accept");
var process_announce_1 = require("./process-announce");
var process_create_1 = require("./process-create");
var process_delete_1 = require("./process-delete");
var process_follow_1 = require("./process-follow");
var process_like_1 = require("./process-like");
var process_reject_1 = require("./process-reject");
var process_undo_1 = require("./process-undo");
var process_update_1 = require("./process-update");
var actor_1 = require("../actor");
var process_dislike_1 = require("./process-dislike");
var process_flag_1 = require("./process-flag");
var process_view_1 = require("./process-view");
var processActivity = {
    Create: process_create_1.processCreateActivity,
    Update: process_update_1.processUpdateActivity,
    Delete: process_delete_1.processDeleteActivity,
    Follow: process_follow_1.processFollowActivity,
    Accept: process_accept_1.processAcceptActivity,
    Reject: process_reject_1.processRejectActivity,
    Announce: process_announce_1.processAnnounceActivity,
    Undo: process_undo_1.processUndoActivity,
    Like: process_like_1.processLikeActivity,
    Dislike: process_dislike_1.processDislikeActivity,
    Flag: process_flag_1.processFlagActivity,
    View: process_view_1.processViewActivity
};
function processActivities(activities, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var outboxUrl, signatureActor, inboxActor, _a, fromFetch, actorsCache, _i, activities_1, activity, actorUrl, byActor, _b, activityProcessor, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    outboxUrl = options.outboxUrl, signatureActor = options.signatureActor, inboxActor = options.inboxActor, _a = options.fromFetch, fromFetch = _a === void 0 ? false : _a;
                    actorsCache = {};
                    _i = 0, activities_1 = activities;
                    _c.label = 1;
                case 1:
                    if (!(_i < activities_1.length)) return [3 /*break*/, 8];
                    activity = activities_1[_i];
                    if (!signatureActor && ['Create', 'Announce', 'Like'].includes(activity.type) === false) {
                        logger_1.logger.error('Cannot process activity %s (type: %s) without the actor signature.', activity.id, activity.type);
                        return [3 /*break*/, 7];
                    }
                    actorUrl = activitypub_1.getAPId(activity.actor);
                    // When we fetch remote data, we don't have signature
                    if (signatureActor && actorUrl !== signatureActor.url) {
                        logger_1.logger.warn('Signature mismatch between %s and %s, skipping.', actorUrl, signatureActor.url);
                        return [3 /*break*/, 7];
                    }
                    if (outboxUrl && activitypub_1.checkUrlsSameHost(outboxUrl, actorUrl) !== true) {
                        logger_1.logger.warn('Host mismatch between outbox URL %s and actor URL %s, skipping.', outboxUrl, actorUrl);
                        return [3 /*break*/, 7];
                    }
                    _b = signatureActor || actorsCache[actorUrl];
                    if (_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, actor_1.getOrCreateActorAndServerAndModel(actorUrl)];
                case 2:
                    _b = (_c.sent());
                    _c.label = 3;
                case 3:
                    byActor = _b;
                    actorsCache[actorUrl] = byActor;
                    activityProcessor = processActivity[activity.type];
                    if (activityProcessor === undefined) {
                        logger_1.logger.warn('Unknown activity type %s.', activity.type, { activityId: activity.id });
                        return [3 /*break*/, 7];
                    }
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, activityProcessor({ activity: activity, byActor: byActor, inboxActor: inboxActor, fromFetch: fromFetch })];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _c.sent();
                    logger_1.logger.warn('Cannot process activity %s.', activity.type, { err: err_1 });
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.processActivities = processActivities;
