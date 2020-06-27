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
exports.__esModule = true;
var sequelize_typescript_1 = require("sequelize-typescript");
var video_1 = require("./video");
var Sequelize = require("sequelize");
var VideoViewModel = /** @class */ (function (_super) {
    __extends(VideoViewModel, _super);
    function VideoViewModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VideoViewModel_1 = VideoViewModel;
    VideoViewModel.removeOldRemoteViewsHistory = function (beforeDate) {
        var _a, _b;
        var query = {
            where: {
                startDate: (_a = {},
                    _a[Sequelize.Op.lt] = beforeDate,
                    _a),
                videoId: (_b = {},
                    _b[Sequelize.Op["in"]] = Sequelize.literal('(SELECT "id" FROM "video" WHERE "remote" IS TRUE)'),
                    _b)
            }
        };
        return VideoViewModel_1.destroy(query);
    };
    var VideoViewModel_1;
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoViewModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column(Sequelize.DATE)
    ], VideoViewModel.prototype, "startDate");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column(Sequelize.DATE)
    ], VideoViewModel.prototype, "endDate");
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Column
    ], VideoViewModel.prototype, "views");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoViewModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.BelongsTo(function () { return video_1.VideoModel; }, {
            foreignKey: {
                allowNull: false
            },
            onDelete: 'CASCADE'
        })
    ], VideoViewModel.prototype, "Video");
    VideoViewModel = VideoViewModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoView',
            updatedAt: false,
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['startDate']
                }
            ]
        })
    ], VideoViewModel);
    return VideoViewModel;
}(sequelize_typescript_1.Model));
exports.VideoViewModel = VideoViewModel;
