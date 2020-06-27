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
var send_1 = require("./send");
var Bluebird = require("bluebird");
var actor_1 = require("./actor");
var account_video_rate_1 = require("../../models/account/account-video-rate");
var logger_1 = require("../../helpers/logger");
var constants_1 = require("../../initializers/constants");
var requests_1 = require("../../helpers/requests");
var activitypub_1 = require("../../helpers/activitypub");
var url_1 = require("./url");
var send_dislike_1 = require("./send/send-dislike");
function createRates(ratesUrl, video, rate) {
    return __awaiter(this, void 0, void 0, function () {
        var rateCounts, field;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rateCounts = 0;
                    return [4 /*yield*/, Bluebird.map(ratesUrl, function (rateUrl) { return __awaiter(_this, void 0, void 0, function () {
                            var body, actorUrl, actor, entry, created, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 4, , 5]);
                                        return [4 /*yield*/, requests_1.doRequest({
                                                uri: rateUrl,
                                                json: true,
                                                activityPub: true
                                            })];
                                    case 1:
                                        body = (_a.sent()).body;
                                        if (!body || !body.actor)
                                            throw new Error('Body or body actor is invalid');
                                        actorUrl = activitypub_1.getAPId(body.actor);
                                        if (activitypub_1.checkUrlsSameHost(actorUrl, rateUrl) !== true) {
                                            throw new Error("Rate url " + rateUrl + " has not the same host than actor url " + actorUrl);
                                        }
                                        if (activitypub_1.checkUrlsSameHost(body.id, rateUrl) !== true) {
                                            throw new Error("Rate url " + rateUrl + " host is different from the AP object id " + body.id);
                                        }
                                        return [4 /*yield*/, actor_1.getOrCreateActorAndServerAndModel(actorUrl)];
                                    case 2:
                                        actor = _a.sent();
                                        entry = {
                                            videoId: video.id,
                                            accountId: actor.Account.id,
                                            type: rate,
                                            url: body.id
                                        };
                                        return [4 /*yield*/, account_video_rate_1.AccountVideoRateModel.upsert(entry)];
                                    case 3:
                                        created = _a.sent();
                                        if (created)
                                            rateCounts += 1;
                                        return [3 /*break*/, 5];
                                    case 4:
                                        err_1 = _a.sent();
                                        logger_1.logger.warn('Cannot add rate %s.', rateUrl, { err: err_1 });
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }, { concurrency: constants_1.CRAWL_REQUEST_CONCURRENCY })];
                case 1:
                    _a.sent();
                    logger_1.logger.info('Adding %d %s to video %s.', rateCounts, rate, video.uuid);
                    if (!(rateCounts !== 0)) return [3 /*break*/, 3];
                    field = rate === 'like' ? 'likes' : 'dislikes';
                    return [4 /*yield*/, video.increment(field, { by: rateCounts })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createRates = createRates;
function sendVideoRateChange(account, video, likes, dislikes, t) {
    return __awaiter(this, void 0, void 0, function () {
        var actor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actor = account.Actor;
                    if (!(likes < 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, send_1.sendUndoLike(actor, video, t)
                        // Undo Dislike
                    ];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(dislikes < 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, send_1.sendUndoDislike(actor, video, t)
                        // Like
                    ];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(likes > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, send_1.sendLike(actor, video, t)
                        // Dislike
                    ];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (!(dislikes > 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, send_dislike_1.sendDislike(actor, video, t)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.sendVideoRateChange = sendVideoRateChange;
function getRateUrl(rateType, actor, video) {
    return rateType === 'like' ? url_1.getVideoLikeActivityPubUrl(actor, video) : url_1.getVideoDislikeActivityPubUrl(actor, video);
}
exports.getRateUrl = getRateUrl;
