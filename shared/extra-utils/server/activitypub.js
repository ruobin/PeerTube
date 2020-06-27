"use strict";
exports.__esModule = true;
var request = require("supertest");
function makeActivityPubGetRequest(url, path, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 200; }
    return request(url)
        .get(path)
        .set('Accept', 'application/activity+json,text/html;q=0.9,\\*/\\*;q=0.8')
        .expect(expectedStatus);
}
exports.makeActivityPubGetRequest = makeActivityPubGetRequest;
