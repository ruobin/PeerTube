"use strict";
/* tslint:disable:no-unused-expression */
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
var chai_1 = require("chai");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var miscs_1 = require("../miscs/miscs");
var requests_1 = require("../requests/requests");
function getAccountsList(url, sort, statusCodeExpected) {
    if (sort === void 0) { sort = '-createdAt'; }
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/accounts';
    return requests_1.makeGetRequest({
        url: url,
        query: { sort: sort },
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.getAccountsList = getAccountsList;
function getAccount(url, accountName, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/accounts/' + accountName;
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.getAccount = getAccount;
function expectAccountFollows(url, nameWithDomain, followersCount, followingCount) {
    return __awaiter(this, void 0, void 0, function () {
        var res, account, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAccountsList(url)];
                case 1:
                    res = _a.sent();
                    account = res.body.data.find(function (a) { return a.name + '@' + a.host === nameWithDomain; });
                    message = nameWithDomain + " on " + url;
                    chai_1.expect(account.followersCount).to.equal(followersCount, message);
                    chai_1.expect(account.followingCount).to.equal(followingCount, message);
                    return [2 /*return*/];
            }
        });
    });
}
exports.expectAccountFollows = expectAccountFollows;
function checkActorFilesWereRemoved(filename, serverNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var testDirectory, _i, _a, directory, directoryPath, directoryExists, files, _b, files_1, file;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    testDirectory = 'test' + serverNumber;
                    _i = 0, _a = ['avatars'];
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    directory = _a[_i];
                    directoryPath = path_1.join(miscs_1.root(), testDirectory, directory);
                    directoryExists = fs_extra_1.existsSync(directoryPath);
                    chai_1.expect(directoryExists).to.be["true"];
                    return [4 /*yield*/, fs_extra_1.readdir(directoryPath)];
                case 2:
                    files = _c.sent();
                    for (_b = 0, files_1 = files; _b < files_1.length; _b++) {
                        file = files_1[_b];
                        chai_1.expect(file).to.not.contain(filename);
                    }
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.checkActorFilesWereRemoved = checkActorFilesWereRemoved;
function getAccountRatings(url, accountName, accessToken, rating, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/accounts/' + accountName + '/ratings';
    var query = rating ? { rating: rating } : {};
    return request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(statusCodeExpected)
        .expect('Content-Type', /json/);
}
exports.getAccountRatings = getAccountRatings;
