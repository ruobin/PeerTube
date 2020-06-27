"use strict";
exports.__esModule = true;
var request = require("supertest");
var __1 = require("..");
function addVideoToBlacklist(url, token, videoId, reason, unfederate, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 204; }
    var path = '/api/v1/videos/' + videoId + '/blacklist';
    return request(url)
        .post(path)
        .send({ reason: reason, unfederate: unfederate })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(specialStatus);
}
exports.addVideoToBlacklist = addVideoToBlacklist;
function updateVideoBlacklist(url, token, videoId, reason, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 204; }
    var path = '/api/v1/videos/' + videoId + '/blacklist';
    return request(url)
        .put(path)
        .send({ reason: reason })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(specialStatus);
}
exports.updateVideoBlacklist = updateVideoBlacklist;
function removeVideoFromBlacklist(url, token, videoId, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 204; }
    var path = '/api/v1/videos/' + videoId + '/blacklist';
    return request(url)["delete"](path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(specialStatus);
}
exports.removeVideoFromBlacklist = removeVideoFromBlacklist;
function getBlacklistedVideosList(parameters) {
    var url = parameters.url, token = parameters.token, sort = parameters.sort, type = parameters.type, _a = parameters.specialStatus, specialStatus = _a === void 0 ? 200 : _a;
    var path = '/api/v1/videos/blacklist/';
    var query = { sort: sort, type: type };
    return __1.makeGetRequest({
        url: url,
        path: path,
        query: query,
        token: token,
        statusCodeExpected: specialStatus
    });
}
exports.getBlacklistedVideosList = getBlacklistedVideosList;
