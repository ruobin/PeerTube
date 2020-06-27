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
var validator = require("validator");
var constants_1 = require("../initializers/constants");
var peertube_crypto_1 = require("./peertube-crypto");
var core_utils_1 = require("./core-utils");
var url_1 = require("url");
function activityPubContextify(data) {
    return Object.assign(data, {
        '@context': [
            'https://www.w3.org/ns/activitystreams',
            'https://w3id.org/security/v1',
            {
                RsaSignature2017: 'https://w3id.org/security#RsaSignature2017',
                pt: 'https://joinpeertube.org/ns#',
                sc: 'http://schema.org#',
                Hashtag: 'as:Hashtag',
                uuid: 'sc:identifier',
                category: 'sc:category',
                licence: 'sc:license',
                subtitleLanguage: 'sc:subtitleLanguage',
                sensitive: 'as:sensitive',
                language: 'sc:inLanguage',
                expires: 'sc:expires',
                CacheFile: 'pt:CacheFile',
                Infohash: 'pt:Infohash',
                originallyPublishedAt: 'sc:datePublished',
                views: {
                    '@type': 'sc:Number',
                    '@id': 'pt:views'
                },
                state: {
                    '@type': 'sc:Number',
                    '@id': 'pt:state'
                },
                size: {
                    '@type': 'sc:Number',
                    '@id': 'pt:size'
                },
                fps: {
                    '@type': 'sc:Number',
                    '@id': 'pt:fps'
                },
                startTimestamp: {
                    '@type': 'sc:Number',
                    '@id': 'pt:startTimestamp'
                },
                stopTimestamp: {
                    '@type': 'sc:Number',
                    '@id': 'pt:stopTimestamp'
                },
                position: {
                    '@type': 'sc:Number',
                    '@id': 'pt:position'
                },
                commentsEnabled: {
                    '@type': 'sc:Boolean',
                    '@id': 'pt:commentsEnabled'
                },
                downloadEnabled: {
                    '@type': 'sc:Boolean',
                    '@id': 'pt:downloadEnabled'
                },
                waitTranscoding: {
                    '@type': 'sc:Boolean',
                    '@id': 'pt:waitTranscoding'
                },
                support: {
                    '@type': 'sc:Text',
                    '@id': 'pt:support'
                }
            },
            {
                likes: {
                    '@id': 'as:likes',
                    '@type': '@id'
                },
                dislikes: {
                    '@id': 'as:dislikes',
                    '@type': '@id'
                },
                playlists: {
                    '@id': 'pt:playlists',
                    '@type': '@id'
                },
                shares: {
                    '@id': 'as:shares',
                    '@type': '@id'
                },
                comments: {
                    '@id': 'as:comments',
                    '@type': '@id'
                }
            }
        ]
    });
}
exports.activityPubContextify = activityPubContextify;
function activityPubCollectionPagination(baseUrl, handler, page) {
    return __awaiter(this, void 0, void 0, function () {
        var result_1, _a, start, count, result, next, prev;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(!page || !validator.isInt(page))) return [3 /*break*/, 2];
                    return [4 /*yield*/, handler(0, 1)];
                case 1:
                    result_1 = _b.sent();
                    return [2 /*return*/, {
                            id: baseUrl,
                            type: 'OrderedCollectionPage',
                            totalItems: result_1.total,
                            first: baseUrl + '?page=1'
                        }];
                case 2:
                    _a = core_utils_1.pageToStartAndCount(page, constants_1.ACTIVITY_PUB.COLLECTION_ITEMS_PER_PAGE), start = _a.start, count = _a.count;
                    return [4 /*yield*/, handler(start, count)];
                case 3:
                    result = _b.sent();
                    // Assert page is a number
                    page = parseInt(page, 10);
                    // There are more results
                    if (result.total > page * constants_1.ACTIVITY_PUB.COLLECTION_ITEMS_PER_PAGE) {
                        next = baseUrl + '?page=' + (page + 1);
                    }
                    if (page > 1) {
                        prev = baseUrl + '?page=' + (page - 1);
                    }
                    return [2 /*return*/, {
                            id: baseUrl + '?page=' + page,
                            type: 'OrderedCollectionPage',
                            prev: prev,
                            next: next,
                            partOf: baseUrl,
                            orderedItems: result.data,
                            totalItems: result.total
                        }];
            }
        });
    });
}
exports.activityPubCollectionPagination = activityPubCollectionPagination;
function buildSignedActivity(byActor, data) {
    var activity = activityPubContextify(data);
    return peertube_crypto_1.signJsonLDObject(byActor, activity);
}
exports.buildSignedActivity = buildSignedActivity;
function getAPId(activity) {
    if (typeof activity === 'string')
        return activity;
    return activity.id;
}
exports.getAPId = getAPId;
function checkUrlsSameHost(url1, url2) {
    var idHost = url_1.parse(url1).host;
    var actorHost = url_1.parse(url2).host;
    return idHost && actorHost && idHost.toLowerCase() === actorHost.toLowerCase();
}
exports.checkUrlsSameHost = checkUrlsSameHost;
