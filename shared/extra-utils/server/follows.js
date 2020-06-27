"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var request = require("supertest");
var jobs_1 = require("./jobs");
var requests_1 = require("../requests/requests");
function getFollowersListPaginationAndSort(url, start, count, sort, search) {
    var path = '/api/v1/server/followers';
    var query = {
        start: start,
        count: count,
        sort: sort,
        search: search
    };
    return request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getFollowersListPaginationAndSort = getFollowersListPaginationAndSort;
function acceptFollower(url, token, follower, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/server/followers/' + follower + '/accept';
    return requests_1.makePostBodyRequest({
        url: url,
        token: token,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.acceptFollower = acceptFollower;
function rejectFollower(url, token, follower, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/server/followers/' + follower + '/reject';
    return requests_1.makePostBodyRequest({
        url: url,
        token: token,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.rejectFollower = rejectFollower;
function getFollowingListPaginationAndSort(url, start, count, sort, search) {
    var path = '/api/v1/server/following';
    var query = {
        start: start,
        count: count,
        sort: sort,
        search: search
    };
    return request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getFollowingListPaginationAndSort = getFollowingListPaginationAndSort;
function follow(follower, following, accessToken, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/server/following';
    var followingHosts = following.map(function (f) { return f.replace(/^http:\/\//, ''); });
    return request(follower)
        .post(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({ 'hosts': followingHosts })
        .expect(expectedStatus);
}
exports.follow = follow;
function unfollow(url, accessToken, target, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    return __awaiter(this, void 0, void 0, function () {
        var path;
        return __generator(this, function (_a) {
            path = '/api/v1/server/following/' + target.host;
            return [2 /*return*/, request(url)["delete"](path)
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(expectedStatus)];
        });
    });
}
exports.unfollow = unfollow;
function removeFollower(url, accessToken, follower, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/server/followers/peertube@' + follower.host;
    return request(url)["delete"](path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(expectedStatus);
}
exports.removeFollower = removeFollower;
function doubleFollow(server1, server2) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        follow(server1.url, [server2.url], server1.accessToken),
                        follow(server2.url, [server1.url], server2.accessToken)
                    ])
                    // Wait request propagation
                ];
                case 1:
                    _a.sent();
                    // Wait request propagation
                    return [4 /*yield*/, jobs_1.waitJobs([server1, server2])];
                case 2:
                    // Wait request propagation
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.doubleFollow = doubleFollow;
