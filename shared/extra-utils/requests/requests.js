"use strict";
exports.__esModule = true;
var request = require("supertest");
var miscs_1 = require("../miscs/miscs");
var path_1 = require("path");
var url_1 = require("url");
function get4KFileUrl() {
    return 'https://download.cpy.re/peertube/4k_file.txt';
}
exports.get4KFileUrl = get4KFileUrl;
function makeRawRequest(url, statusCodeExpected, range) {
    var _a = url_1.parse(url), host = _a.host, protocol = _a.protocol, pathname = _a.pathname;
    return makeGetRequest({ url: protocol + "//" + host, path: pathname, statusCodeExpected: statusCodeExpected, range: range });
}
exports.makeRawRequest = makeRawRequest;
function makeGetRequest(options) {
    if (!options.statusCodeExpected)
        options.statusCodeExpected = 400;
    if (options.contentType === undefined)
        options.contentType = 'application/json';
    var req = request(options.url).get(options.path);
    if (options.contentType)
        req.set('Accept', options.contentType);
    if (options.token)
        req.set('Authorization', 'Bearer ' + options.token);
    if (options.query)
        req.query(options.query);
    if (options.range)
        req.set('Range', options.range);
    return req.expect(options.statusCodeExpected);
}
exports.makeGetRequest = makeGetRequest;
function makeDeleteRequest(options) {
    if (!options.statusCodeExpected)
        options.statusCodeExpected = 400;
    var req = request(options.url)["delete"](options.path)
        .set('Accept', 'application/json');
    if (options.token)
        req.set('Authorization', 'Bearer ' + options.token);
    return req.expect(options.statusCodeExpected);
}
exports.makeDeleteRequest = makeDeleteRequest;
function makeUploadRequest(options) {
    if (!options.statusCodeExpected)
        options.statusCodeExpected = 400;
    var req;
    if (options.method === 'PUT') {
        req = request(options.url).put(options.path);
    }
    else {
        req = request(options.url).post(options.path);
    }
    req.set('Accept', 'application/json');
    if (options.token)
        req.set('Authorization', 'Bearer ' + options.token);
    Object.keys(options.fields).forEach(function (field) {
        var value = options.fields[field];
        if (value === undefined)
            return;
        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                req.field(field + '[' + i + ']', value[i]);
            }
        }
        else {
            req.field(field, value);
        }
    });
    Object.keys(options.attaches).forEach(function (attach) {
        var value = options.attaches[attach];
        if (Array.isArray(value)) {
            req.attach(attach, miscs_1.buildAbsoluteFixturePath(value[0]), value[1]);
        }
        else {
            req.attach(attach, miscs_1.buildAbsoluteFixturePath(value));
        }
    });
    return req.expect(options.statusCodeExpected);
}
exports.makeUploadRequest = makeUploadRequest;
function makePostBodyRequest(options) {
    if (!options.fields)
        options.fields = {};
    if (!options.statusCodeExpected)
        options.statusCodeExpected = 400;
    var req = request(options.url)
        .post(options.path)
        .set('Accept', 'application/json');
    if (options.token)
        req.set('Authorization', 'Bearer ' + options.token);
    return req.send(options.fields)
        .expect(options.statusCodeExpected);
}
exports.makePostBodyRequest = makePostBodyRequest;
function makePutBodyRequest(options) {
    if (!options.statusCodeExpected)
        options.statusCodeExpected = 400;
    var req = request(options.url)
        .put(options.path)
        .set('Accept', 'application/json');
    if (options.token)
        req.set('Authorization', 'Bearer ' + options.token);
    return req.send(options.fields)
        .expect(options.statusCodeExpected);
}
exports.makePutBodyRequest = makePutBodyRequest;
function makeHTMLRequest(url, path) {
    return request(url)
        .get(path)
        .set('Accept', 'text/html')
        .expect(200);
}
exports.makeHTMLRequest = makeHTMLRequest;
function updateAvatarRequest(options) {
    var filePath = '';
    if (path_1.isAbsolute(options.fixture)) {
        filePath = options.fixture;
    }
    else {
        filePath = path_1.join(miscs_1.root(), 'server', 'tests', 'fixtures', options.fixture);
    }
    return makeUploadRequest({
        url: options.url,
        path: options.path,
        token: options.accessToken,
        fields: {},
        attaches: { avatarfile: filePath },
        statusCodeExpected: 200
    });
}
exports.updateAvatarRequest = updateAvatarRequest;
