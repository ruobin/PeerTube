"use strict";
exports.__esModule = true;
var request = require("supertest");
var requests_1 = require("../requests/requests");
function getVideoCommentThreads(url, videoId, start, count, sort, token) {
    var path = '/api/v1/videos/' + videoId + '/comment-threads';
    var req = request(url)
        .get(path)
        .query({ start: start })
        .query({ count: count });
    if (sort)
        req.query({ sort: sort });
    if (token)
        req.set('Authorization', 'Bearer ' + token);
    return req.set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideoCommentThreads = getVideoCommentThreads;
function getVideoThreadComments(url, videoId, threadId, token) {
    var path = '/api/v1/videos/' + videoId + '/comment-threads/' + threadId;
    var req = request(url)
        .get(path)
        .set('Accept', 'application/json');
    if (token)
        req.set('Authorization', 'Bearer ' + token);
    return req.expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideoThreadComments = getVideoThreadComments;
function addVideoCommentThread(url, token, videoId, text, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    var path = '/api/v1/videos/' + videoId + '/comment-threads';
    return request(url)
        .post(path)
        .send({ text: text })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(expectedStatus);
}
exports.addVideoCommentThread = addVideoCommentThread;
function addVideoCommentReply(url, token, videoId, inReplyToCommentId, text, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    var path = '/api/v1/videos/' + videoId + '/comments/' + inReplyToCommentId;
    return request(url)
        .post(path)
        .send({ text: text })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(expectedStatus);
}
exports.addVideoCommentReply = addVideoCommentReply;
function deleteVideoComment(url, token, videoId, commentId, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/videos/' + videoId + '/comments/' + commentId;
    return requests_1.makeDeleteRequest({
        url: url,
        path: path,
        token: token,
        statusCodeExpected: statusCodeExpected
    });
}
exports.deleteVideoComment = deleteVideoComment;
