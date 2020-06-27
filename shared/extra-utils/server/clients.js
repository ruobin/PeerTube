"use strict";
exports.__esModule = true;
var request = require("supertest");
var urlUtil = require("url");
function getClient(url) {
    var path = '/api/v1/oauth-clients/local';
    return request(url)
        .get(path)
        .set('Host', urlUtil.parse(url).host)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getClient = getClient;
