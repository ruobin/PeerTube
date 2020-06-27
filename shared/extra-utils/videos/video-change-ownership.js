"use strict";
exports.__esModule = true;
var request = require("supertest");
function changeVideoOwnership(url, token, videoId, username, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/videos/' + videoId + '/give-ownership';
    return request(url)
        .post(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({ username: username })
        .expect(expectedStatus);
}
exports.changeVideoOwnership = changeVideoOwnership;
function getVideoChangeOwnershipList(url, token) {
    var path = '/api/v1/videos/ownership';
    return request(url)
        .get(path)
        .query({ sort: '-createdAt' })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideoChangeOwnershipList = getVideoChangeOwnershipList;
function acceptChangeOwnership(url, token, ownershipId, channelId, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/videos/ownership/' + ownershipId + '/accept';
    return request(url)
        .post(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({ channelId: channelId })
        .expect(expectedStatus);
}
exports.acceptChangeOwnership = acceptChangeOwnership;
function refuseChangeOwnership(url, token, ownershipId, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/videos/ownership/' + ownershipId + '/refuse';
    return request(url)
        .post(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(expectedStatus);
}
exports.refuseChangeOwnership = refuseChangeOwnership;
