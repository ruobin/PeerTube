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
var url = require("url");
var uuidv4 = require("uuid/v4");
var activitypub_1 = require("../../helpers/activitypub");
var actor_1 = require("../../helpers/custom-validators/activitypub/actor");
var misc_1 = require("../../helpers/custom-validators/activitypub/misc");
var database_utils_1 = require("../../helpers/database-utils");
var logger_1 = require("../../helpers/logger");
var peertube_crypto_1 = require("../../helpers/peertube-crypto");
var requests_1 = require("../../helpers/requests");
var webfinger_1 = require("../../helpers/webfinger");
var constants_1 = require("../../initializers/constants");
var account_1 = require("../../models/account/account");
var actor_2 = require("../../models/activitypub/actor");
var avatar_1 = require("../../models/avatar/avatar");
var server_1 = require("../../models/server/server");
var video_channel_1 = require("../../models/video/video-channel");
var job_queue_1 = require("../job-queue");
var utils_1 = require("../../helpers/utils");
var actor_3 = require("../../helpers/actor");
var database_1 = require("../../initializers/database");
// Set account keys, this could be long so process after the account creation and do not block the client
function setAsyncActorKeys(actor) {
    return peertube_crypto_1.createPrivateAndPublicKeys()
        .then(function (_a) {
        var publicKey = _a.publicKey, privateKey = _a.privateKey;
        actor.set('publicKey', publicKey);
        actor.set('privateKey', privateKey);
        return actor.save();
    })["catch"](function (err) {
        logger_1.logger.error('Cannot set public/private keys of actor %d.', actor.url, { err: err });
        return actor;
    });
}
exports.setAsyncActorKeys = setAsyncActorKeys;
function getOrCreateActorAndServerAndModel(activityActor, fetchType, recurseIfNeeded, updateCollections) {
    if (fetchType === void 0) { fetchType = 'actor-and-association-ids'; }
    if (recurseIfNeeded === void 0) { recurseIfNeeded = true; }
    if (updateCollections === void 0) { updateCollections = false; }
    return __awaiter(this, void 0, void 0, function () {
        var actorUrl, created, accountPlaylistsUrl, actor, result, ownerActor, accountAttributedTo, recurseIfNeeded_1, err_1, _a, actorRefreshed, refreshed, payload, payload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    actorUrl = activitypub_1.getAPId(activityActor);
                    created = false;
                    return [4 /*yield*/, actor_3.fetchActorByUrl(actorUrl, fetchType)
                        // Orphan actor (not associated to an account of channel) so recreate it
                    ];
                case 1:
                    actor = _b.sent();
                    if (!(actor && (!actor.Account && !actor.VideoChannel))) return [3 /*break*/, 3];
                    return [4 /*yield*/, actor.destroy()];
                case 2:
                    _b.sent();
                    actor = null;
                    _b.label = 3;
                case 3:
                    if (!!actor) return [3 /*break*/, 10];
                    return [4 /*yield*/, fetchRemoteActor(actorUrl)];
                case 4:
                    result = (_b.sent()).result;
                    if (result === undefined)
                        throw new Error('Cannot fetch remote actor ' + actorUrl);
                    ownerActor = undefined;
                    if (!(recurseIfNeeded === true && result.actor.type === 'Group')) return [3 /*break*/, 8];
                    accountAttributedTo = result.attributedTo.find(function (a) { return a.type === 'Person'; });
                    if (!accountAttributedTo)
                        throw new Error('Cannot find account attributed to video channel ' + actor.url);
                    if (activitypub_1.checkUrlsSameHost(accountAttributedTo.id, actorUrl) !== true) {
                        throw new Error("Account attributed to " + accountAttributedTo.id + " does not have the same host than actor url " + actorUrl);
                    }
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    recurseIfNeeded_1 = false;
                    return [4 /*yield*/, getOrCreateActorAndServerAndModel(accountAttributedTo.id, 'all', recurseIfNeeded_1)];
                case 6:
                    ownerActor = _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _b.sent();
                    logger_1.logger.error('Cannot get or create account attributed to video channel ' + actor.url);
                    throw new Error(err_1);
                case 8: return [4 /*yield*/, database_utils_1.retryTransactionWrapper(saveActorAndServerAndModelIfNotExist, result, ownerActor)];
                case 9:
                    actor = _b.sent();
                    created = true;
                    accountPlaylistsUrl = result.playlists;
                    _b.label = 10;
                case 10:
                    if (actor.Account)
                        actor.Account.Actor = actor;
                    if (actor.VideoChannel)
                        actor.VideoChannel.Actor = actor;
                    return [4 /*yield*/, database_utils_1.retryTransactionWrapper(refreshActorIfNeeded, actor, fetchType)];
                case 11:
                    _a = _b.sent(), actorRefreshed = _a.actor, refreshed = _a.refreshed;
                    if (!actorRefreshed)
                        throw new Error('Actor ' + actorRefreshed.url + ' does not exist anymore.');
                    if (!((created === true || refreshed === true) && updateCollections === true)) return [3 /*break*/, 13];
                    payload = { uri: actor.outboxUrl, type: 'activity' };
                    return [4 /*yield*/, job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-http-fetcher', payload: payload })];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13:
                    if (!(created === true && actor.Account && accountPlaylistsUrl)) return [3 /*break*/, 15];
                    payload = { uri: accountPlaylistsUrl, accountId: actor.Account.id, type: 'account-playlists' };
                    return [4 /*yield*/, job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-http-fetcher', payload: payload })];
                case 14:
                    _b.sent();
                    _b.label = 15;
                case 15: return [2 /*return*/, actorRefreshed];
            }
        });
    });
}
exports.getOrCreateActorAndServerAndModel = getOrCreateActorAndServerAndModel;
function buildActorInstance(type, url, preferredUsername, uuid) {
    return new actor_2.ActorModel({
        type: type,
        url: url,
        preferredUsername: preferredUsername,
        uuid: uuid,
        publicKey: null,
        privateKey: null,
        followersCount: 0,
        followingCount: 0,
        inboxUrl: url + '/inbox',
        outboxUrl: url + '/outbox',
        sharedInboxUrl: constants_1.WEBSERVER.URL + '/inbox',
        followersUrl: url + '/followers',
        followingUrl: url + '/following'
    });
}
exports.buildActorInstance = buildActorInstance;
function updateActorInstance(actorInstance, attributes) {
    return __awaiter(this, void 0, void 0, function () {
        var followersCount, followingCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchActorTotalItems(attributes.followers)];
                case 1:
                    followersCount = _a.sent();
                    return [4 /*yield*/, fetchActorTotalItems(attributes.following)];
                case 2:
                    followingCount = _a.sent();
                    actorInstance.type = attributes.type;
                    actorInstance.preferredUsername = attributes.preferredUsername;
                    actorInstance.url = attributes.id;
                    actorInstance.publicKey = attributes.publicKey.publicKeyPem;
                    actorInstance.followersCount = followersCount;
                    actorInstance.followingCount = followingCount;
                    actorInstance.inboxUrl = attributes.inbox;
                    actorInstance.outboxUrl = attributes.outbox;
                    actorInstance.sharedInboxUrl = attributes.endpoints.sharedInbox;
                    actorInstance.followersUrl = attributes.followers;
                    actorInstance.followingUrl = attributes.following;
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateActorInstance = updateActorInstance;
function updateActorAvatarInstance(actor, info, t) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2, avatar;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(info.name !== undefined)) return [3 /*break*/, 6];
                    if (!actor.avatarId) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, actor.Avatar.destroy({ transaction: t })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    logger_1.logger.error('Cannot remove old avatar of actor %s.', actor.url, { err: err_2 });
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, avatar_1.AvatarModel.create({
                        filename: info.name,
                        onDisk: info.onDisk,
                        fileUrl: info.fileUrl
                    }, { transaction: t })];
                case 5:
                    avatar = _a.sent();
                    actor.avatarId = avatar.id;
                    actor.Avatar = avatar;
                    _a.label = 6;
                case 6: return [2 /*return*/, actor];
            }
        });
    });
}
exports.updateActorAvatarInstance = updateActorAvatarInstance;
function fetchActorTotalItems(url) {
    return __awaiter(this, void 0, void 0, function () {
        var options, body, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        uri: url,
                        method: 'GET',
                        json: true,
                        activityPub: true
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, requests_1.doRequest(options)];
                case 2:
                    body = (_a.sent()).body;
                    return [2 /*return*/, body.totalItems ? body.totalItems : 0];
                case 3:
                    err_3 = _a.sent();
                    logger_1.logger.warn('Cannot fetch remote actor count %s.', url, { err: err_3 });
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchActorTotalItems = fetchActorTotalItems;
function getAvatarInfoIfExists(actorJSON) {
    return __awaiter(this, void 0, void 0, function () {
        var extension;
        return __generator(this, function (_a) {
            if (actorJSON.icon && actorJSON.icon.type === 'Image' && constants_1.MIMETYPES.IMAGE.MIMETYPE_EXT[actorJSON.icon.mediaType] !== undefined &&
                misc_1.isActivityPubUrlValid(actorJSON.icon.url)) {
                extension = constants_1.MIMETYPES.IMAGE.MIMETYPE_EXT[actorJSON.icon.mediaType];
                return [2 /*return*/, {
                        name: uuidv4() + extension,
                        fileUrl: actorJSON.icon.url
                    }];
            }
            return [2 /*return*/, undefined];
        });
    });
}
exports.getAvatarInfoIfExists = getAvatarInfoIfExists;
function addFetchOutboxJob(actor) {
    return __awaiter(this, void 0, void 0, function () {
        var serverActor, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, utils_1.getServerActor()];
                case 1:
                    serverActor = _a.sent();
                    if (serverActor.id === actor.id) {
                        logger_1.logger.error('Cannot fetch our own outbox!');
                        return [2 /*return*/, undefined];
                    }
                    payload = {
                        uri: actor.outboxUrl,
                        type: 'activity'
                    };
                    return [2 /*return*/, job_queue_1.JobQueue.Instance.createJob({ type: 'activitypub-http-fetcher', payload: payload })];
            }
        });
    });
}
exports.addFetchOutboxJob = addFetchOutboxJob;
function refreshActorIfNeeded(actorArg, fetchedType) {
    return __awaiter(this, void 0, void 0, function () {
        var actor, _a, actorUrl, err_4, _b, result_1, statusCode, err_5;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!actorArg.isOutdated())
                        return [2 /*return*/, { actor: actorArg, refreshed: false }
                            // We need more attributes
                        ];
                    if (!(fetchedType === 'all')) return [3 /*break*/, 1];
                    _a = actorArg;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, actor_2.ActorModel.loadByUrlAndPopulateAccountAndChannel(actorArg.url)];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    actor = _a;
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 10, , 11]);
                    actorUrl = void 0;
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, webfinger_1.getUrlFromWebfinger(actor.preferredUsername + '@' + actor.getHost())];
                case 6:
                    actorUrl = _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_4 = _c.sent();
                    logger_1.logger.warn('Cannot get actor URL from webfinger, keeping the old one.', err_4);
                    actorUrl = actor.url;
                    return [3 /*break*/, 8];
                case 8: return [4 /*yield*/, fetchRemoteActor(actorUrl)];
                case 9:
                    _b = _c.sent(), result_1 = _b.result, statusCode = _b.statusCode;
                    if (statusCode === 404) {
                        logger_1.logger.info('Deleting actor %s because there is a 404 in refresh actor.', actor.url);
                        actor.Account ? actor.Account.destroy() : actor.VideoChannel.destroy();
                        return [2 /*return*/, { actor: undefined, refreshed: false }];
                    }
                    if (result_1 === undefined) {
                        logger_1.logger.warn('Cannot fetch remote actor in refresh actor.');
                        return [2 /*return*/, { actor: actor, refreshed: false }];
                    }
                    return [2 /*return*/, database_1.sequelizeTypescript.transaction(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var avatarInfo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        database_utils_1.updateInstanceWithAnother(actor, result_1.actor);
                                        if (!(result_1.avatar !== undefined)) return [3 /*break*/, 2];
                                        avatarInfo = {
                                            name: result_1.avatar.name,
                                            fileUrl: result_1.avatar.fileUrl,
                                            onDisk: false
                                        };
                                        return [4 /*yield*/, updateActorAvatarInstance(actor, avatarInfo, t)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        // Force update
                                        actor.setDataValue('updatedAt', new Date());
                                        return [4 /*yield*/, actor.save({ transaction: t })];
                                    case 3:
                                        _a.sent();
                                        if (!actor.Account) return [3 /*break*/, 5];
                                        actor.Account.name = result_1.name;
                                        actor.Account.description = result_1.summary;
                                        return [4 /*yield*/, actor.Account.save({ transaction: t })];
                                    case 4:
                                        _a.sent();
                                        return [3 /*break*/, 7];
                                    case 5:
                                        if (!actor.VideoChannel) return [3 /*break*/, 7];
                                        actor.VideoChannel.name = result_1.name;
                                        actor.VideoChannel.description = result_1.summary;
                                        actor.VideoChannel.support = result_1.support;
                                        return [4 /*yield*/, actor.VideoChannel.save({ transaction: t })];
                                    case 6:
                                        _a.sent();
                                        _a.label = 7;
                                    case 7: return [2 /*return*/, { refreshed: true, actor: actor }];
                                }
                            });
                        }); })];
                case 10:
                    err_5 = _c.sent();
                    logger_1.logger.warn('Cannot refresh actor %s.', actor.url, { err: err_5 });
                    return [2 /*return*/, { actor: actor, refreshed: false }];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.refreshActorIfNeeded = refreshActorIfNeeded;
// ---------------------------------------------------------------------------
function saveActorAndServerAndModelIfNotExist(result, ownerActor, t) {
    var actor = result.actor;
    if (t !== undefined)
        return save(t);
    return database_1.sequelizeTypescript.transaction(function (t) { return save(t); });
    function save(t) {
        return __awaiter(this, void 0, void 0, function () {
            var actorHost, serverOptions, server, avatar, actorCreated, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        actorHost = url.parse(actor.url).host;
                        serverOptions = {
                            where: {
                                host: actorHost
                            },
                            defaults: {
                                host: actorHost
                            },
                            transaction: t
                        };
                        return [4 /*yield*/, server_1.ServerModel.findOrCreate(serverOptions)
                            // Save our new account in database
                        ];
                    case 1:
                        server = (_c.sent())[0];
                        // Save our new account in database
                        actor.serverId = server.id;
                        if (!result.avatar) return [3 /*break*/, 3];
                        return [4 /*yield*/, avatar_1.AvatarModel.create({
                                filename: result.avatar.name,
                                fileUrl: result.avatar.fileUrl,
                                onDisk: false
                            }, { transaction: t })];
                    case 2:
                        avatar = _c.sent();
                        actor.avatarId = avatar.id;
                        _c.label = 3;
                    case 3: return [4 /*yield*/, actor_2.ActorModel.findOrCreate({
                            defaults: actor.toJSON(),
                            where: {
                                url: actor.url
                            },
                            transaction: t
                        })];
                    case 4:
                        actorCreated = (_c.sent())[0];
                        if (!(actorCreated.type === 'Person' || actorCreated.type === 'Application')) return [3 /*break*/, 6];
                        _a = actorCreated;
                        return [4 /*yield*/, saveAccount(actorCreated, result, t)];
                    case 5:
                        _a.Account = _c.sent();
                        actorCreated.Account.Actor = actorCreated;
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(actorCreated.type === 'Group')) return [3 /*break*/, 8];
                        _b = actorCreated;
                        return [4 /*yield*/, saveVideoChannel(actorCreated, result, ownerActor, t)];
                    case 7:
                        _b.VideoChannel = _c.sent();
                        actorCreated.VideoChannel.Actor = actorCreated;
                        actorCreated.VideoChannel.Account = ownerActor.Account;
                        _c.label = 8;
                    case 8:
                        actorCreated.Server = server;
                        return [2 /*return*/, actorCreated];
                }
            });
        });
    }
}
function fetchRemoteActor(actorUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var options, requestResult, actorJSON, followersCount, followingCount, actor, avatarInfo, name;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        uri: actorUrl,
                        method: 'GET',
                        json: true,
                        activityPub: true
                    };
                    logger_1.logger.info('Fetching remote actor %s.', actorUrl);
                    return [4 /*yield*/, requests_1.doRequest(options)];
                case 1:
                    requestResult = _a.sent();
                    actorJSON = requestResult.body;
                    if (actor_1.sanitizeAndCheckActorObject(actorJSON) === false) {
                        logger_1.logger.debug('Remote actor JSON is not valid.', { actorJSON: actorJSON });
                        return [2 /*return*/, { result: undefined, statusCode: requestResult.response.statusCode }];
                    }
                    if (activitypub_1.checkUrlsSameHost(actorJSON.id, actorUrl) !== true) {
                        logger_1.logger.warn('Actor url %s has not the same host than its AP id %s', actorUrl, actorJSON.id);
                        return [2 /*return*/, { result: undefined, statusCode: requestResult.response.statusCode }];
                    }
                    return [4 /*yield*/, fetchActorTotalItems(actorJSON.followers)];
                case 2:
                    followersCount = _a.sent();
                    return [4 /*yield*/, fetchActorTotalItems(actorJSON.following)];
                case 3:
                    followingCount = _a.sent();
                    actor = new actor_2.ActorModel({
                        type: actorJSON.type,
                        preferredUsername: actorJSON.preferredUsername,
                        url: actorJSON.id,
                        publicKey: actorJSON.publicKey.publicKeyPem,
                        privateKey: null,
                        followersCount: followersCount,
                        followingCount: followingCount,
                        inboxUrl: actorJSON.inbox,
                        outboxUrl: actorJSON.outbox,
                        sharedInboxUrl: actorJSON.endpoints.sharedInbox,
                        followersUrl: actorJSON.followers,
                        followingUrl: actorJSON.following
                    });
                    return [4 /*yield*/, getAvatarInfoIfExists(actorJSON)];
                case 4:
                    avatarInfo = _a.sent();
                    name = actorJSON.name || actorJSON.preferredUsername;
                    return [2 /*return*/, {
                            statusCode: requestResult.response.statusCode,
                            result: {
                                actor: actor,
                                name: name,
                                avatar: avatarInfo,
                                summary: actorJSON.summary,
                                support: actorJSON.support,
                                playlists: actorJSON.playlists,
                                attributedTo: actorJSON.attributedTo
                            }
                        }];
            }
        });
    });
}
function saveAccount(actor, result, t) {
    return __awaiter(this, void 0, void 0, function () {
        var accountCreated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, account_1.AccountModel.findOrCreate({
                        defaults: {
                            name: result.name,
                            description: result.summary,
                            actorId: actor.id
                        },
                        where: {
                            actorId: actor.id
                        },
                        transaction: t
                    })];
                case 1:
                    accountCreated = (_a.sent())[0];
                    return [2 /*return*/, accountCreated];
            }
        });
    });
}
function saveVideoChannel(actor, result, ownerActor, t) {
    return __awaiter(this, void 0, void 0, function () {
        var videoChannelCreated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, video_channel_1.VideoChannelModel.findOrCreate({
                        defaults: {
                            name: result.name,
                            description: result.summary,
                            support: result.support,
                            actorId: actor.id,
                            accountId: ownerActor.Account.id
                        },
                        where: {
                            actorId: actor.id
                        },
                        transaction: t
                    })];
                case 1:
                    videoChannelCreated = (_a.sent())[0];
                    return [2 /*return*/, videoChannelCreated];
            }
        });
    });
}
