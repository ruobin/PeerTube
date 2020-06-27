"use strict";
exports.__esModule = true;
var request = require("supertest");
var requests_1 = require("../requests/requests");
function reportVideoAbuse(url, token, videoId, reason, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 200; }
    var path = '/api/v1/videos/' + videoId + '/abuse';
    return request(url)
        .post(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send({ reason: reason })
        .expect(specialStatus);
}
exports.reportVideoAbuse = reportVideoAbuse;
function getVideoAbusesList(url, token) {
    var path = '/api/v1/videos/abuse';
    return request(url)
        .get(path)
        .query({ sort: 'createdAt' })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideoAbusesList = getVideoAbusesList;
function updateVideoAbuse(url, token, videoId, videoAbuseId, body, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/videos/' + videoId + '/abuse/' + videoAbuseId;
    return requests_1.makePutBodyRequest({
        url: url,
        token: token,
        path: path,
        fields: body,
        statusCodeExpected: statusCodeExpected
    });
}
exports.updateVideoAbuse = updateVideoAbuse;
function deleteVideoAbuse(url, token, videoId, videoAbuseId, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/videos/' + videoId + '/abuse/' + videoAbuseId;
    return requests_1.makeDeleteRequest({
        url: url,
        token: token,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.deleteVideoAbuse = deleteVideoAbuse;
