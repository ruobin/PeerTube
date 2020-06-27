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
var nodemailer_1 = require("nodemailer");
var core_utils_1 = require("../helpers/core-utils");
var logger_1 = require("../helpers/logger");
var config_1 = require("../initializers/config");
var job_queue_1 = require("./job-queue");
var fs_extra_1 = require("fs-extra");
var constants_1 = require("../initializers/constants");
var Emailer = /** @class */ (function () {
    function Emailer() {
        this.initialized = false;
    }
    Emailer.prototype.init = function () {
        // Already initialized
        if (this.initialized === true)
            return;
        this.initialized = true;
        if (Emailer.isEnabled()) {
            logger_1.logger.info('Using %s:%s as SMTP server.', config_1.CONFIG.SMTP.HOSTNAME, config_1.CONFIG.SMTP.PORT);
            var tls = void 0;
            if (config_1.CONFIG.SMTP.CA_FILE) {
                tls = {
                    ca: [fs_extra_1.readFileSync(config_1.CONFIG.SMTP.CA_FILE)]
                };
            }
            var auth = void 0;
            if (config_1.CONFIG.SMTP.USERNAME && config_1.CONFIG.SMTP.PASSWORD) {
                auth = {
                    user: config_1.CONFIG.SMTP.USERNAME,
                    pass: config_1.CONFIG.SMTP.PASSWORD
                };
            }
            this.transporter = nodemailer_1.createTransport({
                host: config_1.CONFIG.SMTP.HOSTNAME,
                port: config_1.CONFIG.SMTP.PORT,
                secure: config_1.CONFIG.SMTP.TLS,
                debug: config_1.CONFIG.LOG.LEVEL === 'debug',
                logger: logger_1.bunyanLogger,
                ignoreTLS: config_1.CONFIG.SMTP.DISABLE_STARTTLS,
                tls: tls,
                auth: auth
            });
        }
        else {
            if (!core_utils_1.isTestInstance()) {
                logger_1.logger.error('Cannot use SMTP server because of lack of configuration. PeerTube will not be able to send mails!');
            }
        }
    };
    Emailer.isEnabled = function () {
        return !!config_1.CONFIG.SMTP.HOSTNAME && !!config_1.CONFIG.SMTP.PORT;
    };
    Emailer.prototype.checkConnectionOrDie = function () {
        return __awaiter(this, void 0, void 0, function () {
            var success, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.transporter)
                            return [2 /*return*/];
                        logger_1.logger.info('Testing SMTP server...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.transporter.verify()];
                    case 2:
                        success = _a.sent();
                        if (success !== true)
                            this.dieOnConnectionFailure();
                        logger_1.logger.info('Successfully connected to SMTP server.');
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.dieOnConnectionFailure(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Emailer.prototype.addNewVideoFromSubscriberNotification = function (to, video) {
        var channelName = video.VideoChannel.getDisplayName();
        var videoUrl = constants_1.WEBSERVER.URL + video.getWatchStaticPath();
        var text = "Hi dear user,\n\n" +
            ("Your subscription " + channelName + " just published a new video: " + video.name) +
            "\n\n" +
            ("You can view it on " + videoUrl + " ") +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + channelName + ' just published a new video',
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addNewFollowNotification = function (to, actorFollow, followType) {
        var followerName = actorFollow.ActorFollower.Account.getDisplayName();
        var followingName = (actorFollow.ActorFollowing.VideoChannel || actorFollow.ActorFollowing.Account).getDisplayName();
        var text = "Hi dear user,\n\n" +
            ("Your " + followType + " " + followingName + " has a new subscriber: " + followerName) +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'New follower on your channel ' + followingName,
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addNewInstanceFollowerNotification = function (to, actorFollow) {
        var awaitingApproval = actorFollow.state === 'pending' ? ' awaiting manual approval.' : '';
        var text = "Hi dear admin,\n\n" +
            ("Your instance has a new follower: " + actorFollow.ActorFollower.url + awaitingApproval) +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'New instance follower',
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.myVideoPublishedNotification = function (to, video) {
        var videoUrl = constants_1.WEBSERVER.URL + video.getWatchStaticPath();
        var text = "Hi dear user,\n\n" +
            ("Your video " + video.name + " has been published.") +
            "\n\n" +
            ("You can view it on " + videoUrl + " ") +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + ("Your video " + video.name + " is published"),
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.myVideoImportSuccessNotification = function (to, videoImport) {
        var videoUrl = constants_1.WEBSERVER.URL + videoImport.Video.getWatchStaticPath();
        var text = "Hi dear user,\n\n" +
            ("Your video import " + videoImport.getTargetIdentifier() + " is finished.") +
            "\n\n" +
            ("You can view the imported video on " + videoUrl + " ") +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + ("Your video import " + videoImport.getTargetIdentifier() + " is finished"),
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.myVideoImportErrorNotification = function (to, videoImport) {
        var importUrl = constants_1.WEBSERVER.URL + '/my-account/video-imports';
        var text = "Hi dear user,\n\n" +
            ("Your video import " + videoImport.getTargetIdentifier() + " encountered an error.") +
            "\n\n" +
            ("See your videos import dashboard for more information: " + importUrl) +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + ("Your video import " + videoImport.getTargetIdentifier() + " encountered an error"),
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addNewCommentOnMyVideoNotification = function (to, comment) {
        var accountName = comment.Account.getDisplayName();
        var video = comment.Video;
        var commentUrl = constants_1.WEBSERVER.URL + comment.getCommentStaticPath();
        var text = "Hi dear user,\n\n" +
            ("A new comment has been posted by " + accountName + " on your video " + video.name) +
            "\n\n" +
            ("You can view it on " + commentUrl + " ") +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'New comment on your video ' + video.name,
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addNewCommentMentionNotification = function (to, comment) {
        var accountName = comment.Account.getDisplayName();
        var video = comment.Video;
        var commentUrl = constants_1.WEBSERVER.URL + comment.getCommentStaticPath();
        var text = "Hi dear user,\n\n" +
            (accountName + " mentioned you on video " + video.name) +
            "\n\n" +
            ("You can view the comment on " + commentUrl + " ") +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'Mention on video ' + video.name,
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addVideoAbuseModeratorsNotification = function (to, videoAbuse) {
        var videoUrl = constants_1.WEBSERVER.URL + videoAbuse.Video.getWatchStaticPath();
        var text = "Hi,\n\n" +
            (constants_1.WEBSERVER.HOST + " received an abuse for the following video " + videoUrl + "\n\n") +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'Received a video abuse',
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addVideoAutoBlacklistModeratorsNotification = function (to, video) {
        var VIDEO_AUTO_BLACKLIST_URL = constants_1.WEBSERVER.URL + '/admin/moderation/video-auto-blacklist/list';
        var videoUrl = constants_1.WEBSERVER.URL + video.getWatchStaticPath();
        var text = "Hi,\n\n" +
            "A recently added video was auto-blacklisted and requires moderator review before publishing." +
            "\n\n" +
            ("You can view it and take appropriate action on " + videoUrl) +
            "\n\n" +
            ("A full list of auto-blacklisted videos can be reviewed here: " + VIDEO_AUTO_BLACKLIST_URL) +
            "\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'An auto-blacklisted video is awaiting review',
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addNewUserRegistrationNotification = function (to, user) {
        var text = "Hi,\n\n" +
            ("User " + user.username + " just registered on " + constants_1.WEBSERVER.HOST + " PeerTube instance.\n\n") +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'New user registration on ' + constants_1.WEBSERVER.HOST,
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addVideoBlacklistNotification = function (to, videoBlacklist) {
        var videoName = videoBlacklist.Video.name;
        var videoUrl = constants_1.WEBSERVER.URL + videoBlacklist.Video.getWatchStaticPath();
        var reasonString = videoBlacklist.reason ? " for the following reason: " + videoBlacklist.reason : '';
        var blockedString = "Your video " + videoName + " (" + videoUrl + " on " + constants_1.WEBSERVER.HOST + " has been blacklisted" + reasonString + ".";
        var text = 'Hi,\n\n' +
            blockedString +
            '\n\n' +
            'Cheers,\n' +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + ("Video " + videoName + " blacklisted"),
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addVideoUnblacklistNotification = function (to, video) {
        var videoUrl = constants_1.WEBSERVER.URL + video.getWatchStaticPath();
        var text = 'Hi,\n\n' +
            ("Your video " + video.name + " (" + videoUrl + ") on " + constants_1.WEBSERVER.HOST + " has been unblacklisted.") +
            '\n\n' +
            'Cheers,\n' +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: to,
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + ("Video " + video.name + " unblacklisted"),
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addPasswordResetEmailJob = function (to, resetPasswordUrl) {
        var text = "Hi dear user,\n\n" +
            ("A reset password procedure for your account " + to + " has been requested on " + constants_1.WEBSERVER.HOST + " ") +
            ("Please follow this link to reset it: " + resetPasswordUrl + "\n\n") +
            "If you are not the person who initiated this request, please ignore this email.\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: [to],
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'Reset your password',
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addVerifyEmailJob = function (to, verifyEmailUrl) {
        var text = "Welcome to PeerTube,\n\n" +
            ("To start using PeerTube on " + constants_1.WEBSERVER.HOST + " you must  verify your email! ") +
            ("Please follow this link to verify this email belongs to you: " + verifyEmailUrl + "\n\n") +
            "If you are not the person who initiated this request, please ignore this email.\n\n" +
            "Cheers,\n" +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var emailPayload = {
            to: [to],
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'Verify your email',
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addUserBlockJob = function (user, blocked, reason) {
        var reasonString = reason ? " for the following reason: " + reason : '';
        var blockedWord = blocked ? 'blocked' : 'unblocked';
        var blockedString = "Your account " + user.username + " on " + constants_1.WEBSERVER.HOST + " has been " + blockedWord + reasonString + ".";
        var text = 'Hi,\n\n' +
            blockedString +
            '\n\n' +
            'Cheers,\n' +
            ("" + config_1.CONFIG.EMAIL.BODY.SIGNATURE);
        var to = user.email;
        var emailPayload = {
            to: [to],
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + 'Account ' + blockedWord,
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.addContactFormJob = function (fromEmail, fromName, subject, body) {
        var text = 'Hello dear admin,\n\n' +
            fromName + ' sent you a message' +
            '\n\n---------------------------------------\n\n' +
            body +
            '\n\n---------------------------------------\n\n' +
            'Cheers,\n' +
            'PeerTube.';
        var emailPayload = {
            fromDisplayName: fromEmail,
            replyTo: fromEmail,
            to: [config_1.CONFIG.ADMIN.EMAIL],
            subject: config_1.CONFIG.EMAIL.SUBJECT.PREFIX + subject,
            text: text
        };
        return job_queue_1.JobQueue.Instance.createJob({ type: 'email', payload: emailPayload });
    };
    Emailer.prototype.sendMail = function (options) {
        if (!Emailer.isEnabled()) {
            throw new Error('Cannot send mail because SMTP is not configured.');
        }
        var fromDisplayName = options.fromDisplayName
            ? options.fromDisplayName
            : constants_1.WEBSERVER.HOST;
        return this.transporter.sendMail({
            from: "\"" + fromDisplayName + "\" <" + config_1.CONFIG.SMTP.FROM_ADDRESS + ">",
            replyTo: options.replyTo,
            to: options.to.join(','),
            subject: options.subject,
            text: options.text
        });
    };
    Emailer.prototype.dieOnConnectionFailure = function (err) {
        logger_1.logger.error('Failed to connect to SMTP %s:%d.', config_1.CONFIG.SMTP.HOSTNAME, config_1.CONFIG.SMTP.PORT, { err: err });
        process.exit(-1);
    };
    Object.defineProperty(Emailer, "Instance", {
        get: function () {
            return this.instance || (this.instance = new this());
        },
        enumerable: true,
        configurable: true
    });
    return Emailer;
}());
exports.Emailer = Emailer;
