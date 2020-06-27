"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var utils_1 = require("../utils");
var video_1 = require("./video");
var video_captions_1 = require("../../helpers/custom-validators/video-captions");
var constants_1 = require("../../initializers/constants");
var path_1 = require("path");
var logger_1 = require("../../helpers/logger");
var fs_extra_1 = require("fs-extra");
var config_1 = require("../../initializers/config");
var ScopeNames;
(function (ScopeNames) {
    ScopeNames["WITH_VIDEO_UUID_AND_REMOTE"] = "WITH_VIDEO_UUID_AND_REMOTE";
})(ScopeNames = exports.ScopeNames || (exports.ScopeNames = {}));
var VideoCaptionModel = /** @class */ (function (_super) {
    __extends(VideoCaptionModel, _super);
    function VideoCaptionModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoCaptionModel_1 = VideoCaptionModel;
    VideoCaptionModel.removeFiles = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!instance.Video) return [3 /*break*/, 2];
                        _a = instance;
                        return [4 /*yield*/, instance.$get('Video')];
                    case 1:
                        _a.Video = (_b.sent());
                        _b.label = 2;
                    case 2:
                        if (!instance.isOwned()) return [3 /*break*/, 6];
                        logger_1.logger.info('Removing captions %s of video %s.', instance.Video.uuid, instance.language);
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, instance.removeCaptionFile()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _b.sent();
                        logger_1.logger.error('Cannot remove caption file of video %s.', instance.Video.uuid);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, undefined];
                }
            });
        });
    };
    VideoCaptionModel.loadByVideoIdAndLanguage = function (videoId, language) {
        var videoInclude = {
            model: video_1.VideoModel.unscoped(),
            attributes: ['id', 'remote', 'uuid'],
            where: utils_1.buildWhereIdOrUUID(videoId)
        };
        var query = {
            where: {
                language: language
            },
            include: [
                videoInclude
            ]
        };
        return VideoCaptionModel_1.findOne(query);
    };
    VideoCaptionModel.insertOrReplaceLanguage = function (videoId, language, transaction) {
        var values = {
            videoId: videoId,
            language: language
        };
        return VideoCaptionModel_1.upsert(values, { transaction: transaction, returning: true }) // FIXME: typings
            .then(function (_a) {
            var caption = _a[0];
            return caption;
        });
    };
    VideoCaptionModel.listVideoCaptions = function (videoId) {
        var query = {
            order: [['language', 'ASC']],
            where: {
                videoId: videoId
            }
        };
        return VideoCaptionModel_1.scope(ScopeNames.WITH_VIDEO_UUID_AND_REMOTE).findAll(query);
    };
    VideoCaptionModel.getLanguageLabel = function (language) {
        return constants_1.VIDEO_LANGUAGES[language] || 'Unknown';
    };
    VideoCaptionModel.deleteAllCaptionsOfRemoteVideo = function (videoId, transaction) {
        var query = {
            where: {
                videoId: videoId
            },
            transaction: transaction
        };
        return VideoCaptionModel_1.destroy(query);
    };
    VideoCaptionModel.prototype.isOwned = function () {
        return this.Video.remote === false;
    };
    VideoCaptionModel.prototype.toFormattedJSON = function () {
        return {
            language: {
                id: this.language,
                label: VideoCaptionModel_1.getLanguageLabel(this.language)
            },
            captionPath: this.getCaptionStaticPath()
        };
    };
    VideoCaptionModel.prototype.getCaptionStaticPath = function () {
        return path_1.join(constants_1.LAZY_STATIC_PATHS.VIDEO_CAPTIONS, this.getCaptionName());
    };
    VideoCaptionModel.prototype.getCaptionName = function () {
        return this.Video.uuid + "-" + this.language + ".vtt";
    };
    VideoCaptionModel.prototype.removeCaptionFile = function () {
        return fs_extra_1.remove(config_1.CONFIG.STORAGE.CAPTIONS_DIR + this.getCaptionName());
    };
    var VideoCaptionModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoCaptionModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoCaptionModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoCaptionLanguage', function (value) { return utils_1.throwIfNotValid(value, video_captions_1.isVideoCaptionLanguageValid, 'language'); }),
        sequelize_typescript_1.Column
    ], VideoCaptionModel.prototype, "language");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoCaptionModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoCaptionModel.prototype, "Video");
    __decorate([
        sequelize_typescript_1.BeforeDestroy
    ], VideoCaptionModel, "removeFiles");
    VideoCaptionModel = VideoCaptionModel_1 = __decorate([
        sequelize_typescript_1.Scopes(function () {
            var _a;
            return (_a = {},
                _a[ScopeNames.WITH_VIDEO_UUID_AND_REMOTE] = {
                    include: [
                        {
                            attributes: ['uuid', 'remote'],
                            model: video_1.VideoModel.unscoped(),
                            required: true
                        }
                    ]
                },
                _a);
        }),
        sequelize_typescript_1.Table({
            tableName: 'videoCaption',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['videoId', 'language'],
                    unique: true
                }
            ]
        })
    ], VideoCaptionModel);
    return VideoCaptionModel;
}(sequelize_typescript_1.Model));
exports.VideoCaptionModel = VideoCaptionModel;
