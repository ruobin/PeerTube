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
var requests_1 = require("../requests/requests");
var user_role_1 = require("../../models/users/user-role");
var login_1 = require("./login");
function createUser(parameters) {
    var url = parameters.url, accessToken = parameters.accessToken, username = parameters.username, adminFlags = parameters.adminFlags, _a = parameters.password, password = _a === void 0 ? 'password' : _a, _b = parameters.videoQuota, videoQuota = _b === void 0 ? 1000000 : _b, _c = parameters.videoQuotaDaily, videoQuotaDaily = _c === void 0 ? -1 : _c, _d = parameters.role, role = _d === void 0 ? user_role_1.UserRole.USER : _d, _e = parameters.specialStatus, specialStatus = _e === void 0 ? 200 : _e;
    var path = '/api/v1/users';
    var body = {
        username: username,
        password: password,
        role: role,
        adminFlags: adminFlags,
        email: username + '@example.com',
        videoQuota: videoQuota,
        videoQuotaDaily: videoQuotaDaily
    };
    return request(url)
        .post(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .send(body)
        .expect(specialStatus);
}
exports.createUser = createUser;
function generateUserAccessToken(server, username) {
    return __awaiter(this, void 0, void 0, function () {
        var password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = 'my super password';
                    return [4 /*yield*/, createUser({ url: server.url, accessToken: server.accessToken, username: username, password: password })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, login_1.userLogin(server, { username: username, password: password })];
            }
        });
    });
}
exports.generateUserAccessToken = generateUserAccessToken;
function registerUser(url, username, password, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 204; }
    var path = '/api/v1/users/register';
    var body = {
        username: username,
        password: password,
        email: username + '@example.com'
    };
    return request(url)
        .post(path)
        .set('Accept', 'application/json')
        .send(body)
        .expect(specialStatus);
}
exports.registerUser = registerUser;
function registerUserWithChannel(options) {
    var path = '/api/v1/users/register';
    var body = {
        username: options.user.username,
        password: options.user.password,
        email: options.user.username + '@example.com',
        channel: options.channel
    };
    if (options.user.displayName) {
        Object.assign(body, { displayName: options.user.displayName });
    }
    return requests_1.makePostBodyRequest({
        url: options.url,
        path: path,
        fields: body,
        statusCodeExpected: 204
    });
}
exports.registerUserWithChannel = registerUserWithChannel;
function getMyUserInformation(url, accessToken, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 200; }
    var path = '/api/v1/users/me';
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(specialStatus)
        .expect('Content-Type', /json/);
}
exports.getMyUserInformation = getMyUserInformation;
function deleteMe(url, accessToken, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 204; }
    var path = '/api/v1/users/me';
    return request(url)["delete"](path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(specialStatus);
}
exports.deleteMe = deleteMe;
function getMyUserVideoQuotaUsed(url, accessToken, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 200; }
    var path = '/api/v1/users/me/video-quota-used';
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(specialStatus)
        .expect('Content-Type', /json/);
}
exports.getMyUserVideoQuotaUsed = getMyUserVideoQuotaUsed;
function getUserInformation(url, accessToken, userId) {
    var path = '/api/v1/users/' + userId;
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getUserInformation = getUserInformation;
function getMyUserVideoRating(url, accessToken, videoId, specialStatus) {
    if (specialStatus === void 0) { specialStatus = 200; }
    var path = '/api/v1/users/me/videos/' + videoId + '/rating';
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(specialStatus)
        .expect('Content-Type', /json/);
}
exports.getMyUserVideoRating = getMyUserVideoRating;
function getUsersList(url, accessToken) {
    var path = '/api/v1/users';
    return request(url)
        .get(path)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getUsersList = getUsersList;
function getUsersListPaginationAndSort(url, accessToken, start, count, sort, search) {
    var path = '/api/v1/users';
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
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200)
        .expect('Content-Type', /json/);
}
exports.getUsersListPaginationAndSort = getUsersListPaginationAndSort;
function removeUser(url, userId, accessToken, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/users';
    return request(url)["delete"](path + '/' + userId)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(expectedStatus);
}
exports.removeUser = removeUser;
function blockUser(url, userId, accessToken, expectedStatus, reason) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/users';
    var body;
    if (reason)
        body = { reason: reason };
    return request(url)
        .post(path + '/' + userId + '/block')
        .send(body)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(expectedStatus);
}
exports.blockUser = blockUser;
function unblockUser(url, userId, accessToken, expectedStatus) {
    if (expectedStatus === void 0) { expectedStatus = 204; }
    var path = '/api/v1/users';
    return request(url)
        .post(path + '/' + userId + '/unblock')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(expectedStatus);
}
exports.unblockUser = unblockUser;
function updateMyUser(options) {
    var path = '/api/v1/users/me';
    var toSend = {};
    if (options.currentPassword !== undefined && options.currentPassword !== null)
        toSend.currentPassword = options.currentPassword;
    if (options.newPassword !== undefined && options.newPassword !== null)
        toSend.password = options.newPassword;
    if (options.nsfwPolicy !== undefined && options.nsfwPolicy !== null)
        toSend.nsfwPolicy = options.nsfwPolicy;
    if (options.autoPlayVideo !== undefined && options.autoPlayVideo !== null)
        toSend.autoPlayVideo = options.autoPlayVideo;
    if (options.email !== undefined && options.email !== null)
        toSend.email = options.email;
    if (options.description !== undefined && options.description !== null)
        toSend.description = options.description;
    if (options.displayName !== undefined && options.displayName !== null)
        toSend.displayName = options.displayName;
    if (options.theme !== undefined && options.theme !== null)
        toSend.theme = options.theme;
    if (options.videosHistoryEnabled !== undefined && options.videosHistoryEnabled !== null) {
        toSend.videosHistoryEnabled = options.videosHistoryEnabled;
    }
    return requests_1.makePutBodyRequest({
        url: options.url,
        path: path,
        token: options.accessToken,
        fields: toSend,
        statusCodeExpected: 204
    });
}
exports.updateMyUser = updateMyUser;
function updateMyAvatar(options) {
    var path = '/api/v1/users/me/avatar/pick';
    return requests_1.updateAvatarRequest(Object.assign(options, { path: path }));
}
exports.updateMyAvatar = updateMyAvatar;
function updateUser(options) {
    var path = '/api/v1/users/' + options.userId;
    var toSend = {};
    if (options.password !== undefined && options.password !== null)
        toSend['password'] = options.password;
    if (options.email !== undefined && options.email !== null)
        toSend['email'] = options.email;
    if (options.emailVerified !== undefined && options.emailVerified !== null)
        toSend['emailVerified'] = options.emailVerified;
    if (options.videoQuota !== undefined && options.videoQuota !== null)
        toSend['videoQuota'] = options.videoQuota;
    if (options.videoQuotaDaily !== undefined && options.videoQuotaDaily !== null)
        toSend['videoQuotaDaily'] = options.videoQuotaDaily;
    if (options.role !== undefined && options.role !== null)
        toSend['role'] = options.role;
    if (options.adminFlags !== undefined && options.adminFlags !== null)
        toSend['adminFlags'] = options.adminFlags;
    return requests_1.makePutBodyRequest({
        url: options.url,
        path: path,
        token: options.accessToken,
        fields: toSend,
        statusCodeExpected: 204
    });
}
exports.updateUser = updateUser;
function askResetPassword(url, email) {
    var path = '/api/v1/users/ask-reset-password';
    return requests_1.makePostBodyRequest({
        url: url,
        path: path,
        fields: { email: email },
        statusCodeExpected: 204
    });
}
exports.askResetPassword = askResetPassword;
function resetPassword(url, userId, verificationString, password, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/users/' + userId + '/reset-password';
    return requests_1.makePostBodyRequest({
        url: url,
        path: path,
        fields: { password: password, verificationString: verificationString },
        statusCodeExpected: statusCodeExpected
    });
}
exports.resetPassword = resetPassword;
function askSendVerifyEmail(url, email) {
    var path = '/api/v1/users/ask-send-verify-email';
    return requests_1.makePostBodyRequest({
        url: url,
        path: path,
        fields: { email: email },
        statusCodeExpected: 204
    });
}
exports.askSendVerifyEmail = askSendVerifyEmail;
function verifyEmail(url, userId, verificationString, isPendingEmail, statusCodeExpected) {
    if (isPendingEmail === void 0) { isPendingEmail = false; }
    if (statusCodeExpected === void 0) { statusCodeExpected = 204; }
    var path = '/api/v1/users/' + userId + '/verify-email';
    return requests_1.makePostBodyRequest({
        url: url,
        path: path,
        fields: {
            verificationString: verificationString,
            isPendingEmail: isPendingEmail
        },
        statusCodeExpected: statusCodeExpected
    });
}
exports.verifyEmail = verifyEmail;
