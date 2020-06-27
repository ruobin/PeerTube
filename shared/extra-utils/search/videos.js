"use strict";
/* tslint:disable:no-unused-expression */
exports.__esModule = true;
var request = require("supertest");
var miscs_1 = require("../miscs/miscs");
function searchVideo(url, search) {
    var path = '/api/v1/search/videos';
    var query = { sort: '-publishedAt', search: search };
    var req = request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json');
    return req.expect(200)
        .expect('Content-Type', /json/);
}
exports.searchVideo = searchVideo;
function searchVideoWithToken(url, search, token, query) {
    if (query === void 0) { query = {}; }
    var path = '/api/v1/search/videos';
    var req = request(url)
        .get(path)
        .set('Authorization', 'Bearer ' + token)
        .query(miscs_1.immutableAssign(query, { sort: '-publishedAt', search: search }))
        .set('Accept', 'application/json');
    return req.expect(200)
        .expect('Content-Type', /json/);
}
exports.searchVideoWithToken = searchVideoWithToken;
function searchVideoWithPagination(url, search, start, count, sort) {
    var path = '/api/v1/search/videos';
    var query = {
        start: start,
        search: search,
        count: count
    };
    var req = request(url)
        .get(path)
        .query(query);
    if (sort)
        req.query({ sort: sort });
    return req.set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.searchVideoWithPagination = searchVideoWithPagination;
function searchVideoWithSort(url, search, sort) {
    var path = '/api/v1/search/videos';
    var query = { search: search, sort: sort };
    return request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.searchVideoWithSort = searchVideoWithSort;
function advancedVideosSearch(url, options) {
    var path = '/api/v1/search/videos';
    return request(url)
        .get(path)
        .query(options)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.advancedVideosSearch = advancedVideosSearch;
