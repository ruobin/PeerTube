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
var miscs_1 = require("../miscs/miscs");
function getJobsList(url, accessToken, state) {
    var path = '/api/v1/jobs/' + state;
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getJobsList = getJobsList;
function getJobsListPaginationAndSort(url, accessToken, state, start, count, sort) {
    var path = '/api/v1/jobs/' + state;
    return request(url)
        .get(path)
        .query({ start: start })
        .query({ count: count })
        .query({ sort: sort })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getJobsListPaginationAndSort = getJobsListPaginationAndSort;
function waitJobs(serversArg) {
    return __awaiter(this, void 0, void 0, function () {
        function tasksBuilder() {
            var tasks = [];
            // Check if each server has pending request
            for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
                var server = servers_1[_i];
                for (var _a = 0, states_1 = states; _a < states_1.length; _a++) {
                    var state = states_1[_a];
                    var p = getJobsListPaginationAndSort(server.url, server.accessToken, state, 0, 10, '-createdAt')
                        .then(function (res) { return res.body.data; })
                        .then(function (jobs) { return jobs.filter(function (j) { return j.type !== 'videos-views'; }); })
                        .then(function (jobs) {
                        if (jobs.length !== 0) {
                            pendingRequests = true;
                        }
                    });
                    tasks.push(p);
                }
            }
            return tasks;
        }
        var pendingJobWait, servers, states, pendingRequests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pendingJobWait = process.env.NODE_PENDING_JOB_WAIT ? parseInt(process.env.NODE_PENDING_JOB_WAIT, 10) : 2000;
                    if (Array.isArray(serversArg) === false)
                        servers = [serversArg];
                    else
                        servers = serversArg;
                    states = ['waiting', 'active', 'delayed'];
                    _a.label = 1;
                case 1:
                    pendingRequests = false;
                    return [4 /*yield*/, Promise.all(tasksBuilder())
                        // Retry, in case of new jobs were created
                    ];
                case 2:
                    _a.sent();
                    if (!(pendingRequests === false)) return [3 /*break*/, 5];
                    return [4 /*yield*/, miscs_1.wait(pendingJobWait)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(tasksBuilder())];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!pendingRequests) return [3 /*break*/, 7];
                    return [4 /*yield*/, miscs_1.wait(1000)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    if (pendingRequests) return [3 /*break*/, 1];
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.waitJobs = waitJobs;
