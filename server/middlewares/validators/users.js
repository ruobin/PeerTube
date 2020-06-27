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
var _this = this;
exports.__esModule = true;
var express_validator_1 = require("express-validator");
var lodash_1 = require("lodash");
var misc_1 = require("../../helpers/custom-validators/misc");
var users_1 = require("../../helpers/custom-validators/users");
var logger_1 = require("../../helpers/logger");
var signup_1 = require("../../helpers/signup");
var redis_1 = require("../../lib/redis");
var user_1 = require("../../models/account/user");
var utils_1 = require("./utils");
var actor_1 = require("../../models/activitypub/actor");
var actor_2 = require("../../helpers/custom-validators/activitypub/actor");
var video_channels_1 = require("../../helpers/custom-validators/video-channels");
var plugins_1 = require("../../helpers/custom-validators/plugins");
var theme_utils_1 = require("../../lib/plugins/theme-utils");
var middlewares_1 = require("../../helpers/middlewares");
var users_2 = require("../../../shared/models/users");
var usersAddValidator = [
    express_validator_1.body('username').custom(users_1.isUserUsernameValid).withMessage('Should have a valid username (lowercase alphanumeric characters)'),
    express_validator_1.body('password').custom(users_1.isUserPasswordValid).withMessage('Should have a valid password'),
    express_validator_1.body('email').isEmail().withMessage('Should have a valid email'),
    express_validator_1.body('videoQuota').custom(users_1.isUserVideoQuotaValid).withMessage('Should have a valid user quota'),
    express_validator_1.body('videoQuotaDaily').custom(users_1.isUserVideoQuotaDailyValid).withMessage('Should have a valid daily user quota'),
    express_validator_1.body('role')
        .customSanitizer(misc_1.toIntOrNull)
        .custom(users_1.isUserRoleValid).withMessage('Should have a valid role'),
    express_validator_1.body('adminFlags').optional().custom(users_1.isUserAdminFlagsValid).withMessage('Should have a valid admin flags'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var authUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersAdd parameters', { parameters: lodash_1.omit(req.body, 'password') });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserNameOrEmailDoesNotAlreadyExist(req.body.username, req.body.email, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    authUser = res.locals.oauth.token.User;
                    if (authUser.role !== users_2.UserRole.ADMINISTRATOR && req.body.role !== users_2.UserRole.USER) {
                        return [2 /*return*/, res.status(403)
                                .json({ error: 'You can only create users (and not administrators or moderators)' })];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersAddValidator = usersAddValidator;
var usersRegisterValidator = [
    express_validator_1.body('username').custom(users_1.isUserUsernameValid).withMessage('Should have a valid username'),
    express_validator_1.body('password').custom(users_1.isUserPasswordValid).withMessage('Should have a valid password'),
    express_validator_1.body('email').isEmail().withMessage('Should have a valid email'),
    express_validator_1.body('displayName')
        .optional()
        .custom(users_1.isUserDisplayNameValid).withMessage('Should have a valid display name'),
    express_validator_1.body('channel.name')
        .optional()
        .custom(actor_2.isActorPreferredUsernameValid).withMessage('Should have a valid channel name'),
    express_validator_1.body('channel.displayName')
        .optional()
        .custom(video_channels_1.isVideoChannelNameValid).withMessage('Should have a valid display name'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var body, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersRegister parameters', { parameters: lodash_1.omit(req.body, 'password') });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserNameOrEmailDoesNotAlreadyExist(req.body.username, req.body.email, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    body = req.body;
                    if (!body.channel) return [3 /*break*/, 3];
                    if (!body.channel.name || !body.channel.displayName) {
                        return [2 /*return*/, res.status(400)
                                .json({ error: 'Channel is optional but if you specify it, channel.name and channel.displayName are required.' })];
                    }
                    if (body.channel.name === body.username) {
                        return [2 /*return*/, res.status(400)
                                .json({ error: 'Channel name cannot be the same than user username.' })];
                    }
                    return [4 /*yield*/, actor_1.ActorModel.loadLocalByName(body.channel.name)];
                case 2:
                    existing = _a.sent();
                    if (existing) {
                        return [2 /*return*/, res.status(409)
                                .json({ error: "Channel with name " + body.channel.name + " already exists." })];
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersRegisterValidator = usersRegisterValidator;
var usersRemoveValidator = [
    express_validator_1.param('id').isInt().not().isEmpty().withMessage('Should have a valid id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersRemove parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserIdExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.user;
                    if (user.username === 'root') {
                        return [2 /*return*/, res.status(400)
                                .json({ error: 'Cannot remove the root user' })];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersRemoveValidator = usersRemoveValidator;
var usersBlockingValidator = [
    express_validator_1.param('id').isInt().not().isEmpty().withMessage('Should have a valid id'),
    express_validator_1.body('reason').optional().custom(users_1.isUserBlockedReasonValid).withMessage('Should have a valid blocking reason'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersBlocking parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserIdExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.user;
                    if (user.username === 'root') {
                        return [2 /*return*/, res.status(400)
                                .json({ error: 'Cannot block the root user' })];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersBlockingValidator = usersBlockingValidator;
var deleteMeValidator = [
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            user = res.locals.oauth.token.User;
            if (user.username === 'root') {
                return [2 /*return*/, res.status(400)
                        .json({ error: 'You cannot delete your root account.' })
                        .end()];
            }
            return [2 /*return*/, next()];
        });
    }); }
];
exports.deleteMeValidator = deleteMeValidator;
var usersUpdateValidator = [
    express_validator_1.param('id').isInt().not().isEmpty().withMessage('Should have a valid id'),
    express_validator_1.body('password').optional().custom(users_1.isUserPasswordValid).withMessage('Should have a valid password'),
    express_validator_1.body('email').optional().isEmail().withMessage('Should have a valid email attribute'),
    express_validator_1.body('emailVerified').optional().isBoolean().withMessage('Should have a valid email verified attribute'),
    express_validator_1.body('videoQuota').optional().custom(users_1.isUserVideoQuotaValid).withMessage('Should have a valid user quota'),
    express_validator_1.body('videoQuotaDaily').optional().custom(users_1.isUserVideoQuotaDailyValid).withMessage('Should have a valid daily user quota'),
    express_validator_1.body('role')
        .optional()
        .customSanitizer(misc_1.toIntOrNull)
        .custom(users_1.isUserRoleValid).withMessage('Should have a valid role'),
    express_validator_1.body('adminFlags').optional().custom(users_1.isUserAdminFlagsValid).withMessage('Should have a valid admin flags'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersUpdate parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserIdExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.user;
                    if (user.username === 'root' && req.body.role !== undefined && user.role !== req.body.role) {
                        return [2 /*return*/, res.status(400)
                                .json({ error: 'Cannot change root role.' })];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersUpdateValidator = usersUpdateValidator;
var usersUpdateMeValidator = [
    express_validator_1.body('displayName')
        .optional()
        .custom(users_1.isUserDisplayNameValid).withMessage('Should have a valid display name'),
    express_validator_1.body('description')
        .optional()
        .custom(users_1.isUserDescriptionValid).withMessage('Should have a valid description'),
    express_validator_1.body('currentPassword')
        .optional()
        .custom(users_1.isUserPasswordValid).withMessage('Should have a valid current password'),
    express_validator_1.body('password')
        .optional()
        .custom(users_1.isUserPasswordValid).withMessage('Should have a valid password'),
    express_validator_1.body('email')
        .optional()
        .isEmail().withMessage('Should have a valid email attribute'),
    express_validator_1.body('nsfwPolicy')
        .optional()
        .custom(users_1.isUserNSFWPolicyValid).withMessage('Should have a valid display Not Safe For Work policy'),
    express_validator_1.body('autoPlayVideo')
        .optional()
        .custom(users_1.isUserAutoPlayVideoValid).withMessage('Should have a valid automatically plays video attribute'),
    express_validator_1.body('videoLanguages')
        .optional()
        .custom(users_1.isUserVideoLanguages).withMessage('Should have a valid video languages attribute'),
    express_validator_1.body('videosHistoryEnabled')
        .optional()
        .custom(users_1.isUserVideosHistoryEnabledValid).withMessage('Should have a valid videos history enabled attribute'),
    express_validator_1.body('theme')
        .optional()
        .custom(function (v) { return plugins_1.isThemeNameValid(v) && theme_utils_1.isThemeRegistered(v); }).withMessage('Should have a valid theme'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersUpdateMe parameters', { parameters: lodash_1.omit(req.body, 'password') });
                    if (!(req.body.password || req.body.email)) return [3 /*break*/, 2];
                    if (!req.body.currentPassword) {
                        return [2 /*return*/, res.status(400)
                                .json({ error: 'currentPassword parameter is missing.' })
                                .end()];
                    }
                    user = res.locals.oauth.token.User;
                    return [4 /*yield*/, user.isPasswordMatch(req.body.currentPassword)];
                case 1:
                    if ((_a.sent()) !== true) {
                        return [2 /*return*/, res.status(401)
                                .json({ error: 'currentPassword is invalid.' })];
                    }
                    _a.label = 2;
                case 2:
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersUpdateMeValidator = usersUpdateMeValidator;
var usersGetValidator = [
    express_validator_1.param('id').isInt().not().isEmpty().withMessage('Should have a valid id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersGet parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserIdExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersGetValidator = usersGetValidator;
var usersVideoRatingValidator = [
    express_validator_1.param('videoId').custom(misc_1.isIdOrUUIDValid).not().isEmpty().withMessage('Should have a valid video id'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersVideoRating parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, middlewares_1.doesVideoExist(req.params.videoId, res, 'id')];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersVideoRatingValidator = usersVideoRatingValidator;
var ensureUserRegistrationAllowed = [
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var allowed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signup_1.isSignupAllowed()];
                case 1:
                    allowed = _a.sent();
                    if (allowed === false) {
                        return [2 /*return*/, res.status(403)
                                .json({ error: 'User registration is not enabled or user limit is reached.' })];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.ensureUserRegistrationAllowed = ensureUserRegistrationAllowed;
var ensureUserRegistrationAllowedForIP = [
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var allowed;
        return __generator(this, function (_a) {
            allowed = signup_1.isSignupAllowedForCurrentIP(req.ip);
            if (allowed === false) {
                return [2 /*return*/, res.status(403)
                        .json({ error: 'You are not on a network authorized for registration.' })];
            }
            return [2 /*return*/, next()];
        });
    }); }
];
exports.ensureUserRegistrationAllowedForIP = ensureUserRegistrationAllowedForIP;
var usersAskResetPasswordValidator = [
    express_validator_1.body('email').isEmail().not().isEmpty().withMessage('Should have a valid email'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var exists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersAskResetPassword parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserEmailExist(req.body.email, res, false)];
                case 1:
                    exists = _a.sent();
                    if (!exists) {
                        logger_1.logger.debug('User with email %s does not exist (asking reset password).', req.body.email);
                        // Do not leak our emails
                        return [2 /*return*/, res.status(204).end()];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersAskResetPasswordValidator = usersAskResetPasswordValidator;
var usersResetPasswordValidator = [
    express_validator_1.param('id').isInt().not().isEmpty().withMessage('Should have a valid id'),
    express_validator_1.body('verificationString').not().isEmpty().withMessage('Should have a valid verification string'),
    express_validator_1.body('password').custom(users_1.isUserPasswordValid).withMessage('Should have a valid password'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, redisVerificationString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersResetPassword parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserIdExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.user;
                    return [4 /*yield*/, redis_1.Redis.Instance.getResetPasswordLink(user.id)];
                case 2:
                    redisVerificationString = _a.sent();
                    if (redisVerificationString !== req.body.verificationString) {
                        return [2 /*return*/, res
                                .status(403)
                                .json({ error: 'Invalid verification string.' })];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersResetPasswordValidator = usersResetPasswordValidator;
var usersAskSendVerifyEmailValidator = [
    express_validator_1.body('email').isEmail().not().isEmpty().withMessage('Should have a valid email'),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var exists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking askUsersSendVerifyEmail parameters', { parameters: req.body });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserEmailExist(req.body.email, res, false)];
                case 1:
                    exists = _a.sent();
                    if (!exists) {
                        logger_1.logger.debug('User with email %s does not exist (asking verify email).', req.body.email);
                        // Do not leak our emails
                        return [2 /*return*/, res.status(204).end()];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersAskSendVerifyEmailValidator = usersAskSendVerifyEmailValidator;
var usersVerifyEmailValidator = [
    express_validator_1.param('id')
        .isInt().not().isEmpty().withMessage('Should have a valid id'),
    express_validator_1.body('verificationString')
        .not().isEmpty().withMessage('Should have a valid verification string'),
    express_validator_1.body('isPendingEmail')
        .optional()
        .customSanitizer(misc_1.toBooleanOrNull),
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, redisVerificationString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Checking usersVerifyEmail parameters', { parameters: req.params });
                    if (utils_1.areValidationErrors(req, res))
                        return [2 /*return*/];
                    return [4 /*yield*/, checkUserIdExist(req.params.id, res)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    user = res.locals.user;
                    return [4 /*yield*/, redis_1.Redis.Instance.getVerifyEmailLink(user.id)];
                case 2:
                    redisVerificationString = _a.sent();
                    if (redisVerificationString !== req.body.verificationString) {
                        return [2 /*return*/, res
                                .status(403)
                                .json({ error: 'Invalid verification string.' })];
                    }
                    return [2 /*return*/, next()];
            }
        });
    }); }
];
exports.usersVerifyEmailValidator = usersVerifyEmailValidator;
var userAutocompleteValidator = [
    express_validator_1.param('search').isString().not().isEmpty().withMessage('Should have a search parameter')
];
exports.userAutocompleteValidator = userAutocompleteValidator;
var ensureAuthUserOwnsAccountValidator = [
    function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            user = res.locals.oauth.token.User;
            if (res.locals.account.id !== user.Account.id) {
                return [2 /*return*/, res.status(403)
                        .json({ error: 'Only owner can access ratings list.' })];
            }
            return [2 /*return*/, next()];
        });
    }); }
];
exports.ensureAuthUserOwnsAccountValidator = ensureAuthUserOwnsAccountValidator;
var ensureCanManageUser = [
    function (req, res, next) {
        var authUser = res.locals.oauth.token.User;
        var onUser = res.locals.user;
        if (authUser.role === users_2.UserRole.ADMINISTRATOR)
            return next();
        if (authUser.role === users_2.UserRole.MODERATOR && onUser.role === users_2.UserRole.USER)
            return next();
        return res.status(403)
            .json({ error: 'A moderator can only manager users.' });
    }
];
exports.ensureCanManageUser = ensureCanManageUser;
// ---------------------------------------------------------------------------
function checkUserIdExist(id, res) {
    return checkUserExist(function () { return user_1.UserModel.loadById(id); }, res);
}
function checkUserEmailExist(email, res, abortResponse) {
    if (abortResponse === void 0) { abortResponse = true; }
    return checkUserExist(function () { return user_1.UserModel.loadByEmail(email); }, res, abortResponse);
}
function checkUserNameOrEmailDoesNotAlreadyExist(username, email, res) {
    return __awaiter(this, void 0, void 0, function () {
        var user, actor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.UserModel.loadByUsernameOrEmail(username, email)];
                case 1:
                    user = _a.sent();
                    if (user) {
                        res.status(409)
                            .json({ error: 'User with this username or email already exists.' });
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, actor_1.ActorModel.loadLocalByName(username)];
                case 2:
                    actor = _a.sent();
                    if (actor) {
                        res.status(409)
                            .json({ error: 'Another actor (account/channel) with this name on this instance already exists or has already existed.' });
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function checkUserExist(finder, res, abortResponse) {
    if (abortResponse === void 0) { abortResponse = true; }
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, finder()];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        if (abortResponse === true) {
                            res.status(404)
                                .json({ error: 'User not found' });
                        }
                        return [2 /*return*/, false];
                    }
                    res.locals.user = user;
                    return [2 /*return*/, true];
            }
        });
    });
}
