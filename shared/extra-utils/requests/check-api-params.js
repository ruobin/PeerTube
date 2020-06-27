"use strict";
exports.__esModule = true;
var requests_1 = require("./requests");
var miscs_1 = require("../miscs/miscs");
function checkBadStartPagination(url, path, token, query) {
    if (query === void 0) { query = {}; }
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        token: token,
        query: miscs_1.immutableAssign(query, { start: 'hello' }),
        statusCodeExpected: 400
    });
}
exports.checkBadStartPagination = checkBadStartPagination;
function checkBadCountPagination(url, path, token, query) {
    if (query === void 0) { query = {}; }
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        token: token,
        query: miscs_1.immutableAssign(query, { count: 'hello' }),
        statusCodeExpected: 400
    });
}
exports.checkBadCountPagination = checkBadCountPagination;
function checkBadSortPagination(url, path, token, query) {
    if (query === void 0) { query = {}; }
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        token: token,
        query: miscs_1.immutableAssign(query, { sort: 'hello' }),
        statusCodeExpected: 400
    });
}
exports.checkBadSortPagination = checkBadSortPagination;
