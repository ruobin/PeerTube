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
var sequelize_typescript_1 = require("sequelize-typescript");
var core_utils_1 = require("../helpers/core-utils");
var logger_1 = require("../helpers/logger");
var account_1 = require("../models/account/account");
var account_video_rate_1 = require("../models/account/account-video-rate");
var user_1 = require("../models/account/user");
var actor_1 = require("../models/activitypub/actor");
var actor_follow_1 = require("../models/activitypub/actor-follow");
var application_1 = require("../models/application/application");
var avatar_1 = require("../models/avatar/avatar");
var oauth_client_1 = require("../models/oauth/oauth-client");
var oauth_token_1 = require("../models/oauth/oauth-token");
var server_1 = require("../models/server/server");
var tag_1 = require("../models/video/tag");
var video_1 = require("../models/video/video");
var video_abuse_1 = require("../models/video/video-abuse");
var video_blacklist_1 = require("../models/video/video-blacklist");
var video_channel_1 = require("../models/video/video-channel");
var video_comment_1 = require("../models/video/video-comment");
var video_file_1 = require("../models/video/video-file");
var video_share_1 = require("../models/video/video-share");
var video_tag_1 = require("../models/video/video-tag");
var config_1 = require("./config");
var schedule_video_update_1 = require("../models/video/schedule-video-update");
var video_caption_1 = require("../models/video/video-caption");
var video_import_1 = require("../models/video/video-import");
var video_views_1 = require("../models/video/video-views");
var video_change_ownership_1 = require("../models/video/video-change-ownership");
var video_redundancy_1 = require("../models/redundancy/video-redundancy");
var user_video_history_1 = require("../models/account/user-video-history");
var account_blocklist_1 = require("../models/account/account-blocklist");
var server_blocklist_1 = require("../models/server/server-blocklist");
var user_notification_1 = require("../models/account/user-notification");
var user_notification_setting_1 = require("../models/account/user-notification-setting");
var video_streaming_playlist_1 = require("../models/video/video-streaming-playlist");
var video_playlist_1 = require("../models/video/video-playlist");
var video_playlist_element_1 = require("../models/video/video-playlist-element");
var thumbnail_1 = require("../models/video/thumbnail");
var plugin_1 = require("../models/server/plugin");
var sequelize_1 = require("sequelize");
require('pg').defaults.parseInt8 = true; // Avoid BIGINT to be converted to string
var dbname = config_1.CONFIG.DATABASE.DBNAME;
var username = config_1.CONFIG.DATABASE.USERNAME;
var password = config_1.CONFIG.DATABASE.PASSWORD;
var host = config_1.CONFIG.DATABASE.HOSTNAME;
var port = config_1.CONFIG.DATABASE.PORT;
var poolMax = config_1.CONFIG.DATABASE.POOL.MAX;
var sequelizeTypescript = new sequelize_typescript_1.Sequelize({
    database: dbname,
    dialect: 'postgres',
    host: host,
    port: port,
    username: username,
    password: password,
    pool: {
        max: poolMax
    },
    benchmark: core_utils_1.isTestInstance(),
    isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    logging: function (message, benchmark) {
        if (process.env.NODE_DB_LOG === 'false')
            return;
        var newMessage = message;
        if (core_utils_1.isTestInstance() === true && benchmark !== undefined) {
            newMessage += ' | ' + benchmark + 'ms';
        }
        logger_1.logger.debug(newMessage);
    }
});
exports.sequelizeTypescript = sequelizeTypescript;
function initDatabaseModels(silent) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sequelizeTypescript.addModels([
                        application_1.ApplicationModel,
                        actor_1.ActorModel,
                        actor_follow_1.ActorFollowModel,
                        avatar_1.AvatarModel,
                        account_1.AccountModel,
                        oauth_client_1.OAuthClientModel,
                        oauth_token_1.OAuthTokenModel,
                        server_1.ServerModel,
                        tag_1.TagModel,
                        account_video_rate_1.AccountVideoRateModel,
                        user_1.UserModel,
                        video_abuse_1.VideoAbuseModel,
                        video_1.VideoModel,
                        video_change_ownership_1.VideoChangeOwnershipModel,
                        video_channel_1.VideoChannelModel,
                        video_share_1.VideoShareModel,
                        video_file_1.VideoFileModel,
                        video_caption_1.VideoCaptionModel,
                        video_blacklist_1.VideoBlacklistModel,
                        video_tag_1.VideoTagModel,
                        video_comment_1.VideoCommentModel,
                        schedule_video_update_1.ScheduleVideoUpdateModel,
                        video_import_1.VideoImportModel,
                        video_views_1.VideoViewModel,
                        video_redundancy_1.VideoRedundancyModel,
                        user_video_history_1.UserVideoHistoryModel,
                        account_blocklist_1.AccountBlocklistModel,
                        server_blocklist_1.ServerBlocklistModel,
                        user_notification_1.UserNotificationModel,
                        user_notification_setting_1.UserNotificationSettingModel,
                        video_streaming_playlist_1.VideoStreamingPlaylistModel,
                        video_playlist_1.VideoPlaylistModel,
                        video_playlist_element_1.VideoPlaylistElementModel,
                        thumbnail_1.ThumbnailModel,
                        plugin_1.PluginModel
                    ]);
                    // Check extensions exist in the database
                    return [4 /*yield*/, checkPostgresExtensions()
                        // Create custom PostgreSQL functions
                    ];
                case 1:
                    // Check extensions exist in the database
                    _a.sent();
                    // Create custom PostgreSQL functions
                    return [4 /*yield*/, createFunctions()];
                case 2:
                    // Create custom PostgreSQL functions
                    _a.sent();
                    if (!silent)
                        logger_1.logger.info('Database %s is ready.', dbname);
                    return [2 /*return*/];
            }
        });
    });
}
exports.initDatabaseModels = initDatabaseModels;
// ---------------------------------------------------------------------------
function checkPostgresExtensions() {
    return __awaiter(this, void 0, void 0, function () {
        var promises;
        return __generator(this, function (_a) {
            promises = [
                checkPostgresExtension('pg_trgm'),
                checkPostgresExtension('unaccent')
            ];
            return [2 /*return*/, Promise.all(promises)];
        });
    });
}
function checkPostgresExtension(extension) {
    return __awaiter(this, void 0, void 0, function () {
        var query, options, res, _a, errorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "SELECT 1 FROM pg_available_extensions WHERE name = '" + extension + "' AND installed_version IS NOT NULL;";
                    options = {
                        type: sequelize_1.QueryTypes.SELECT,
                        raw: true
                    };
                    return [4 /*yield*/, sequelizeTypescript.query(query, options)];
                case 1:
                    res = _b.sent();
                    if (!(!res || res.length === 0)) return [3 /*break*/, 5];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, sequelizeTypescript.query("CREATE EXTENSION " + extension + ";", { raw: true })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    errorMessage = "You need to enable " + extension + " extension in PostgreSQL. " +
                        ("You can do so by running 'CREATE EXTENSION " + extension + ";' as a PostgreSQL super user in " + config_1.CONFIG.DATABASE.DBNAME + " database.");
                    throw new Error(errorMessage);
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = "CREATE OR REPLACE FUNCTION immutable_unaccent(text)\n  RETURNS text AS\n$func$\nSELECT public.unaccent('public.unaccent', $1::text)\n$func$  LANGUAGE sql IMMUTABLE;";
            return [2 /*return*/, sequelizeTypescript.query(query, { raw: true })];
        });
    });
}
