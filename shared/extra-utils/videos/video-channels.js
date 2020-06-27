"use strict";
exports.__esModule = true;
var request = require("supertest");
var requests_1 = require("../requests/requests");
var users_1 = require("../users/users");
function getVideoChannelsList(url, start, count, sort) {
    var path = '/api/v1/video-channels';
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
exports.getVideoChannelsList = getVideoChannelsList;
function getAccountVideoChannelsList(parameters) {
    var url = parameters.url, accountName = parameters.accountName, start = parameters.start, count = parameters.count, _a = parameters.sort, sort = _a === void 0 ? 'createdAt' : _a, _b = parameters.specialStatus, specialStatus = _b === void 0 ? 200 : _b;
    var path = '/api/v1/accounts/' + accountName + '/video-channels';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        query: {
            start: start,
            count: count,
            sort: sort
        },
        statusCodeExpected: specialStatus
    });
}
exports.getAccountVideoChannelsList = getAccountVideoChannelsList;
function addVideoChannel(url, token, videoChannelAttributesArg, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    var path = '/api/v1/video-channels/';
    // Default attributes
    var attributes = {
        displayName: 'my super video channel',
        description: 'my super channel description',
        support: 'my super channel support'
    };
    attributes = Object.assign(attributes, videoChannelAttributesArg);
    return request(url)
        .post(path)
        .send(attributes)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(expectedStatus);
}
exports.addVideoChannel = addVideoChannel;
function updateVideoChannel(url, token, channelName, attributes, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var body = {};
    var path = '/api/v1/video-channels/' + channelName;
    if (attributes.displayName)
        body.displayName = attributes.displayName;
    if (attributes.description)
        body.description = attributes.description;
    if (attributes.support)
        body.support = attributes.support;
    if (attributes.bulkVideosSupportUpdate)
        body.bulkVideosSupportUpdate = attributes.bulkVideosSupportUpdate;
    return request(url)
        .put(path)
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(expectedStatus);
}
exports.updateVideoChannel = updateVideoChannel;
function deleteVideoChannel(url, token, channelName, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/video-channels/' + channelName;
    return request(url)["delete"](path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(expectedStatus);
}
exports.deleteVideoChannel = deleteVideoChannel;
function getVideoChannel(url, channelName) {
    var path = '/api/v1/video-channels/' + channelName;
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getVideoChannel = getVideoChannel;
function updateVideoChannelAvatar(options) {
    var path = '/api/v1/video-channels/' + options.videoChannelName + '/avatar/pick';
    return requests_1.updateAvatarRequest(Object.assign(options, { path: path }));
}
exports.updateVideoChannelAvatar = updateVideoChannelAvatar;
function setDefaultVideoChannel(servers) {
    var tasks = [];
    var _loop_1 = function (server) {
        var p = users_1.getMyUserInformation(server.url, server.accessToken)
            .then(function (res) { return server.videoChannel = res.body.videoChannels[0]; });
        tasks.push(p);
    };
    for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
        var server = servers_1[_i];
        _loop_1(server);
    }
    return Promise.all(tasks);
}
exports.setDefaultVideoChannel = setDefaultVideoChannel;
