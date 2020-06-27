"use strict";
/* tslint:disable:no-unused-expression */
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
var chai_1 = require("chai");
var fs_extra_1 = require("fs-extra");
var parseTorrent = require("parse-torrent");
var path_1 = require("path");
var request = require("supertest");
var __1 = require("../");
var validator = require("validator");
var videos_1 = require("../../models/videos");
var constants_1 = require("../../../server/initializers/constants");
var miscs_1 = require("../miscs/miscs");
constants_1.loadLanguages();
function getVideoCategories(url) {
    var path = '/api/v1/videos/categories';
    return __1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getVideoCategories = getVideoCategories;
function getVideoLicences(url) {
    var path = '/api/v1/videos/licences';
    return __1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getVideoLicences = getVideoLicences;
function getVideoLanguages(url) {
    var path = '/api/v1/videos/languages';
    return __1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getVideoLanguages = getVideoLanguages;
function getVideoPrivacies(url) {
    var path = '/api/v1/videos/privacies';
    return __1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getVideoPrivacies = getVideoPrivacies;
function getVideo(url, id, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    var path = '/api/v1/videos/' + id;
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .expect(expectedStatus);
}
exports.getVideo = getVideo;
function viewVideo(url, id, expectedStatus, xForwardedFor) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/videos/' + id + '/views';
    var req = request(url)
        .post(path)
        .set('Accept', 'application/json');
    if (xForwardedFor) {
        req.set('X-Forwarded-For', xForwardedFor);
    }
    return req.expect(expectedStatus);
}
exports.viewVideo = viewVideo;
function getVideoWithToken(url, token, id, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    var path = '/api/v1/videos/' + id;
    return request(url)
        .get(path)
        .set('Authorization', 'Bearer ' + token)
        .set('Accept', 'application/json')
        .expect(expectedStatus);
}
exports.getVideoWithToken = getVideoWithToken;
function getVideoDescription(url, descriptionPath) {
    return request(url)
        .get(descriptionPath)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideoDescription = getVideoDescription;
function getVideosList(url) {
    var path = '/api/v1/videos';
    return request(url)
        .get(path)
        .query({ sort: 'name' })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideosList = getVideosList;
function getVideosListWithToken(url, token, query) {
    if (query === void 0) { query = {}; }
    var path = '/api/v1/videos';
    return request(url)
        .get(path)
        .set('Authorization', 'Bearer ' + token)
        .query(__1.immutableAssign(query, { sort: 'name' }))
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideosListWithToken = getVideosListWithToken;
function getLocalVideos(url) {
    var path = '/api/v1/videos';
    return request(url)
        .get(path)
        .query({ sort: 'name', filter: 'local' })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getLocalVideos = getLocalVideos;
function getMyVideos(url, accessToken, start, count, sort) {
    var path = '/api/v1/users/me/videos';
    var req = request(url)
        .get(path)
        .query({ start: start })
        .query({ count: count });
    if (sort)
        req.query({ sort: sort });
    return req.set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getMyVideos = getMyVideos;
function getAccountVideos(url, accessToken, accountName, start, count, sort, query) {
    if (query === void 0) { query = {}; }
    var path = '/api/v1/accounts/' + accountName + '/videos';
    return __1.makeGetRequest({
        url: url,
        path: path,
        query: __1.immutableAssign(query, {
            start: start,
            count: count,
            sort: sort
        }),
        token: accessToken,
        statusCodeExpected: 200
    });
}
exports.getAccountVideos = getAccountVideos;
function getVideoChannelVideos(url, accessToken, videoChannelName, start, count, sort, query) {
    if (query === void 0) { query = {}; }
    var path = '/api/v1/video-channels/' + videoChannelName + '/videos';
    return __1.makeGetRequest({
        url: url,
        path: path,
        query: __1.immutableAssign(query, {
            start: start,
            count: count,
            sort: sort
        }),
        token: accessToken,
        statusCodeExpected: 200
    });
}
exports.getVideoChannelVideos = getVideoChannelVideos;
function getPlaylistVideos(url, accessToken, playlistId, start, count, query) {
    if (query === void 0) { query = {}; }
    var path = '/api/v1/video-playlists/' + playlistId + '/videos';
    return __1.makeGetRequest({
        url: url,
        path: path,
        query: __1.immutableAssign(query, {
            start: start,
            count: count
        }),
        token: accessToken,
        statusCodeExpected: 200
    });
}
exports.getPlaylistVideos = getPlaylistVideos;
function getVideosListPagination(url, start, count, sort) {
    var path = '/api/v1/videos';
    var req = request(url)
        .get(path)
        .query({ start: start })
        .query({ count: count });
    if (sort)
        req.query({ sort: sort });
    return req.set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideosListPagination = getVideosListPagination;
function getVideosListSort(url, sort) {
    var path = '/api/v1/videos';
    return request(url)
        .get(path)
        .query({ sort: sort })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideosListSort = getVideosListSort;
function getVideosWithFilters(url, query) {
    var path = '/api/v1/videos';
    return request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideosWithFilters = getVideosWithFilters;
function removeVideo(url, token, id, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/videos';
    return request(url)["delete"](path + '/' + id)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(expectedStatus);
}
exports.removeVideo = removeVideo;
function checkVideoFilesWereRemoved(videoUUID, serverNumber, directories) {
    if (directories === void 0) { directories = [
        'redundancy',
        'videos',
        'thumbnails',
        'torrents',
        'previews',
        'captions',
        path_1.join('playlists', 'hls'),
        path_1.join('redundancy', 'hls')
    ]; }
    return __awaiter(this, void 0, void 0, function () {
        var _i, directories_1, directory, directoryPath, directoryExists, files, _a, files_1, file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, directories_1 = directories;
                    _b.label = 1;
                case 1:
                    if (!(_i < directories_1.length)) return [3 /*break*/, 5];
                    directory = directories_1[_i];
                    directoryPath = miscs_1.buildServerDirectory(serverNumber, directory);
                    return [4 /*yield*/, fs_extra_1.pathExists(directoryPath)];
                case 2:
                    directoryExists = _b.sent();
                    if (directoryExists === false)
                        return [3 /*break*/, 4];
                    return [4 /*yield*/, fs_extra_1.readdir(directoryPath)];
                case 3:
                    files = _b.sent();
                    for (_a = 0, files_1 = files; _a < files_1.length; _a++) {
                        file = files_1[_a];
                        chai_1.expect(file).to.not.contain(videoUUID);
                    }
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.checkVideoFilesWereRemoved = checkVideoFilesWereRemoved;
function uploadVideo(url, accessToken, videoAttributesArg, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 200; }
    return __awaiter(this, void 0, void 0, function () {
        var path, defaultChannelId, res, e_1, attributes, req, tags, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = '/api/v1/videos/upload';
                    defaultChannelId = '1';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, __1.getMyUserInformation(url, accessToken)];
                case 2:
                    res = _a.sent();
                    defaultChannelId = res.body.videoChannels[0].id;
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    attributes = Object.assign({
                        name: 'my super video',
                        category: 5,
                        licence: 4,
                        language: 'zh',
                        channelId: defaultChannelId,
                        nsfw: true,
                        waitTranscoding: false,
                        description: 'my super description',
                        support: 'my super support text',
                        tags: ['tag'],
                        privacy: videos_1.VideoPrivacy.PUBLIC,
                        commentsEnabled: true,
                        downloadEnabled: true,
                        fixture: 'video_short.webm'
                    }, videoAttributesArg);
                    req = request(url)
                        .post(path)
                        .set('Accept', 'application/json')
                        .set('Authorization', 'Bearer ' + accessToken)
                        .field('name', attributes.name)
                        .field('nsfw', JSON.stringify(attributes.nsfw))
                        .field('commentsEnabled', JSON.stringify(attributes.commentsEnabled))
                        .field('downloadEnabled', JSON.stringify(attributes.downloadEnabled))
                        .field('waitTranscoding', JSON.stringify(attributes.waitTranscoding))
                        .field('privacy', attributes.privacy.toString())
                        .field('channelId', attributes.channelId);
                    if (attributes.support !== undefined) {
                        req.field('support', attributes.support);
                    }
                    if (attributes.description !== undefined) {
                        req.field('description', attributes.description);
                    }
                    if (attributes.language !== undefined) {
                        req.field('language', attributes.language.toString());
                    }
                    if (attributes.category !== undefined) {
                        req.field('category', attributes.category.toString());
                    }
                    if (attributes.licence !== undefined) {
                        req.field('licence', attributes.licence.toString());
                    }
                    tags = attributes.tags || [];
                    for (i = 0; i < tags.length; i++) {
                        req.field('tags[' + i + ']', attributes.tags[i]);
                    }
                    if (attributes.thumbnailfile !== undefined) {
                        req.attach('thumbnailfile', __1.buildAbsoluteFixturePath(attributes.thumbnailfile));
                    }
                    if (attributes.previewfile !== undefined) {
                        req.attach('previewfile', __1.buildAbsoluteFixturePath(attributes.previewfile));
                    }
                    if (attributes.scheduleUpdate) {
                        req.field('scheduleUpdate[updateAt]', attributes.scheduleUpdate.updateAt);
                        if (attributes.scheduleUpdate.privacy) {
                            req.field('scheduleUpdate[privacy]', attributes.scheduleUpdate.privacy);
                        }
                    }
                    if (attributes.originallyPublishedAt !== undefined) {
                        req.field('originallyPublishedAt', attributes.originallyPublishedAt);
                    }
                    return [2 /*return*/, req.attach('videofile', __1.buildAbsoluteFixturePath(attributes.fixture))
                            .expect(specialStatus)];
            }
        });
    });
}
exports.uploadVideo = uploadVideo;
function updateVideo(url, accessToken, id, attributes, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/videos/' + id;
    var body = {};
    if (attributes.name)
        body['name'] = attributes.name;
    if (attributes.category)
        body['category'] = attributes.category;
    if (attributes.licence)
        body['licence'] = attributes.licence;
    if (attributes.language)
        body['language'] = attributes.language;
    if (attributes.nsfw !== undefined)
        body['nsfw'] = JSON.stringify(attributes.nsfw);
    if (attributes.commentsEnabled !== undefined)
        body['commentsEnabled'] = JSON.stringify(attributes.commentsEnabled);
    if (attributes.downloadEnabled !== undefined)
        body['downloadEnabled'] = JSON.stringify(attributes.downloadEnabled);
    if (attributes.originallyPublishedAt !== undefined)
        body['originallyPublishedAt'] = attributes.originallyPublishedAt;
    if (attributes.description)
        body['description'] = attributes.description;
    if (attributes.tags)
        body['tags'] = attributes.tags;
    if (attributes.privacy)
        body['privacy'] = attributes.privacy;
    if (attributes.channelId)
        body['channelId'] = attributes.channelId;
    if (attributes.scheduleUpdate)
        body['scheduleUpdate'] = attributes.scheduleUpdate;
    // Upload request
    if (attributes.thumbnailfile || attributes.previewfile) {
        var attaches = {};
        if (attributes.thumbnailfile)
            attaches.thumbnailfile = attributes.thumbnailfile;
        if (attributes.previewfile)
            attaches.previewfile = attributes.previewfile;
        return __1.makeUploadRequest({
            url: url,
            method: 'PUT',
            path: path,
            token: accessToken,
            fields: body,
            attaches: attaches,
            statusCodeExpected: statusCodeExpected
        });
    }
    return __1.makePutBodyRequest({
        url: url,
        path: path,
        fields: body,
        token: accessToken,
        statusCodeExpected: statusCodeExpected
    });
}
exports.updateVideo = updateVideo;
function rateVideo(url, accessToken, id, rating, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 204; }
    var path = '/api/v1/videos/' + id + '/rate';
    return request(url)
        .put(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ rating: rating })
        .expect(specialStatus);
}
exports.rateVideo = rateVideo;
function parseTorrentVideo(server, videoUUID, resolution) {
    return new Promise(function (res, rej) {
        var torrentName = videoUUID + '-' + resolution + '.torrent';
        var torrentPath = path_1.join(__1.root(), 'test' + server.serverNumber, 'torrents', torrentName);
        fs_extra_1.readFile(torrentPath, function (err, data) {
            if (err)
                return rej(err);
            return res(parseTorrent(data));
        });
    });
}
exports.parseTorrentVideo = parseTorrentVideo;
function completeVideoCheck(url, video, attributes) {
    return __awaiter(this, void 0, void 0, function () {
        var res, videoDetails, _loop_1, _i, _a, attributeFile;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!attributes.likes)
                        attributes.likes = 0;
                    if (!attributes.dislikes)
                        attributes.dislikes = 0;
                    chai_1.expect(video.name).to.equal(attributes.name);
                    chai_1.expect(video.category.id).to.equal(attributes.category);
                    chai_1.expect(video.category.label).to.equal(attributes.category !== null ? constants_1.VIDEO_CATEGORIES[attributes.category] : 'Misc');
                    chai_1.expect(video.licence.id).to.equal(attributes.licence);
                    chai_1.expect(video.licence.label).to.equal(attributes.licence !== null ? constants_1.VIDEO_LICENCES[attributes.licence] : 'Unknown');
                    chai_1.expect(video.language.id).to.equal(attributes.language);
                    chai_1.expect(video.language.label).to.equal(attributes.language !== null ? constants_1.VIDEO_LANGUAGES[attributes.language] : 'Unknown');
                    chai_1.expect(video.privacy.id).to.deep.equal(attributes.privacy);
                    chai_1.expect(video.privacy.label).to.deep.equal(constants_1.VIDEO_PRIVACIES[attributes.privacy]);
                    chai_1.expect(video.nsfw).to.equal(attributes.nsfw);
                    chai_1.expect(video.description).to.equal(attributes.description);
                    chai_1.expect(video.account.id).to.be.a('number');
                    chai_1.expect(video.account.host).to.equal(attributes.account.host);
                    chai_1.expect(video.account.name).to.equal(attributes.account.name);
                    chai_1.expect(video.channel.displayName).to.equal(attributes.channel.displayName);
                    chai_1.expect(video.channel.name).to.equal(attributes.channel.name);
                    chai_1.expect(video.likes).to.equal(attributes.likes);
                    chai_1.expect(video.dislikes).to.equal(attributes.dislikes);
                    chai_1.expect(video.isLocal).to.equal(attributes.isLocal);
                    chai_1.expect(video.duration).to.equal(attributes.duration);
                    chai_1.expect(miscs_1.dateIsValid(video.createdAt)).to.be["true"];
                    chai_1.expect(miscs_1.dateIsValid(video.publishedAt)).to.be["true"];
                    chai_1.expect(miscs_1.dateIsValid(video.updatedAt)).to.be["true"];
                    if (attributes.publishedAt) {
                        chai_1.expect(video.publishedAt).to.equal(attributes.publishedAt);
                    }
                    if (attributes.originallyPublishedAt) {
                        chai_1.expect(video.originallyPublishedAt).to.equal(attributes.originallyPublishedAt);
                    }
                    else {
                        chai_1.expect(video.originallyPublishedAt).to.be["null"];
                    }
                    return [4 /*yield*/, getVideo(url, video.uuid)];
                case 1:
                    res = _b.sent();
                    videoDetails = res.body;
                    chai_1.expect(videoDetails.files).to.have.lengthOf(attributes.files.length);
                    chai_1.expect(videoDetails.tags).to.deep.equal(attributes.tags);
                    chai_1.expect(videoDetails.account.name).to.equal(attributes.account.name);
                    chai_1.expect(videoDetails.account.host).to.equal(attributes.account.host);
                    chai_1.expect(video.channel.displayName).to.equal(attributes.channel.displayName);
                    chai_1.expect(video.channel.name).to.equal(attributes.channel.name);
                    chai_1.expect(videoDetails.channel.host).to.equal(attributes.account.host);
                    chai_1.expect(videoDetails.channel.isLocal).to.equal(attributes.channel.isLocal);
                    chai_1.expect(miscs_1.dateIsValid(videoDetails.channel.createdAt.toString())).to.be["true"];
                    chai_1.expect(miscs_1.dateIsValid(videoDetails.channel.updatedAt.toString())).to.be["true"];
                    chai_1.expect(videoDetails.commentsEnabled).to.equal(attributes.commentsEnabled);
                    chai_1.expect(videoDetails.downloadEnabled).to.equal(attributes.downloadEnabled);
                    _loop_1 = function (attributeFile) {
                        var file, extension, magnetUri, minSize, maxSize, torrent;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    file = videoDetails.files.find(function (f) { return f.resolution.id === attributeFile.resolution; });
                                    chai_1.expect(file).not.to.be.undefined;
                                    extension = path_1.extname(attributes.fixture);
                                    // Transcoding enabled: extension will always be .mp4
                                    if (attributes.files.length > 1)
                                        extension = '.mp4';
                                    magnetUri = file.magnetUri;
                                    chai_1.expect(file.magnetUri).to.have.lengthOf.above(2);
                                    chai_1.expect(file.torrentUrl).to.equal("http://" + attributes.account.host + "/static/torrents/" + videoDetails.uuid + "-" + file.resolution.id + ".torrent");
                                    chai_1.expect(file.fileUrl).to.equal("http://" + attributes.account.host + "/static/webseed/" + videoDetails.uuid + "-" + file.resolution.id + extension);
                                    chai_1.expect(file.resolution.id).to.equal(attributeFile.resolution);
                                    chai_1.expect(file.resolution.label).to.equal(attributeFile.resolution + 'p');
                                    minSize = attributeFile.size - ((10 * attributeFile.size) / 100);
                                    maxSize = attributeFile.size + ((10 * attributeFile.size) / 100);
                                    chai_1.expect(file.size, 'File size for resolution ' + file.resolution.label + ' outside confidence interval (' + minSize + '> size <' + maxSize + ')')
                                        .to.be.above(minSize).and.below(maxSize);
                                    return [4 /*yield*/, __1.testImage(url, attributes.thumbnailfile || attributes.fixture, videoDetails.thumbnailPath)];
                                case 1:
                                    _a.sent();
                                    if (!attributes.previewfile) return [3 /*break*/, 3];
                                    return [4 /*yield*/, __1.testImage(url, attributes.previewfile, videoDetails.previewPath)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [4 /*yield*/, miscs_1.webtorrentAdd(magnetUri, true)];
                                case 4:
                                    torrent = _a.sent();
                                    chai_1.expect(torrent.files).to.be.an('array');
                                    chai_1.expect(torrent.files.length).to.equal(1);
                                    chai_1.expect(torrent.files[0].path).to.exist.and.to.not.equal('');
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = attributes.files;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    attributeFile = _a[_i];
                    return [5 /*yield**/, _loop_1(attributeFile)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.completeVideoCheck = completeVideoCheck;
function videoUUIDToId(url, id) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (validator.isUUID('' + id) === false)
                        return [2 /*return*/, id];
                    return [4 /*yield*/, getVideo(url, id)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.body.id];
            }
        });
    });
}
exports.videoUUIDToId = videoUUIDToId;
function uploadVideoAndGetId(options) {
    return __awaiter(this, void 0, void 0, function () {
        var videoAttrs, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoAttrs = { name: options.videoName };
                    if (options.nsfw)
                        videoAttrs.nsfw = options.nsfw;
                    return [4 /*yield*/, uploadVideo(options.server.url, options.token || options.server.accessToken, videoAttrs)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, { id: res.body.video.id, uuid: res.body.video.uuid }];
            }
        });
    });
}
exports.uploadVideoAndGetId = uploadVideoAndGetId;
