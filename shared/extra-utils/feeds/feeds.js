"use strict";
exports.__esModule = true;
var request = require("supertest");
function getXMLfeed(url, feed, format) {
    var path = '/feeds/' + feed + '.xml';
    return request(url)
        .get(path)
        .query((format) ? { format: format } : {})
        .set('Accept', 'application/xml')
        .expect(200)
        .expect('Content-Type', /xml/);
}
exports.getXMLfeed = getXMLfeed;
function getJSONfeed(url, feed, query) {
    if (query === void 0) { query = {}; }
    var path = '/feeds/' + feed + '.json';
    return request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getJSONfeed = getJSONfeed;
