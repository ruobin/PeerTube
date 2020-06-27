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
var sequelize_1 = require("sequelize");
var sequelize_typescript_1 = require("sequelize-typescript");
var videos_1 = require("../../helpers/custom-validators/videos");
var utils_1 = require("../utils");
var video_1 = require("./video");
var video_tag_1 = require("./video-tag");
var videos_2 = require("../../../shared/models/videos");
var TagModel = /** @class */ (function (_super) {
    __extends(TagModel, _super);
    function TagModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TagModel_1 = TagModel;
    TagModel.findOrCreateTags = function (tags, transaction) {
        if (tags === null)
            return [];
        var tasks = [];
        tags.forEach(function (tag) {
            var query = {
                where: {
                    name: tag
                },
                defaults: {
                    name: tag
                },
                transaction: transaction
            };
            var promise = TagModel_1.findOrCreate(query)
                .then(function (_a) {
                var tagInstance = _a[0];
                return tagInstance;
            });
            tasks.push(promise);
        });
        return Promise.all(tasks);
    };
    // threshold corresponds to how many video the field should have to be returned
    TagModel.getRandomSamples = function (threshold, count) {
        var query = 'SELECT tag.name FROM tag ' +
            'INNER JOIN "videoTag" ON "videoTag"."tagId" = tag.id ' +
            'INNER JOIN video ON video.id = "videoTag"."videoId" ' +
            'WHERE video.privacy = $videoPrivacy AND video.state = $videoState ' +
            'GROUP BY tag.name HAVING COUNT(tag.name) >= $threshold ' +
            'ORDER BY random() ' +
            'LIMIT $count';
        var options = {
            bind: { threshold: threshold, count: count, videoPrivacy: videos_2.VideoPrivacy.PUBLIC, videoState: videos_2.VideoState.PUBLISHED },
            type: sequelize_1.QueryTypes.SELECT
        };
        return TagModel_1.sequelize.query(query, options)
            .then(function (data) { return data.map(function (d) { return d.name; }); });
    };
    var TagModel_1;
    __decorate([
        sequelize_typescript_1.AllowNull(false),
        sequelize_typescript_1.Is('VideoTag', function (value) { return utils_1.throwIfNotValid(value, videos_1.isVideoTagValid, 'tag'); }),
        sequelize_typescript_1.Column
    ], TagModel.prototype, "name");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], TagModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], TagModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.BelongsToMany(function () { return video_1.VideoModel; }, {
            foreignKey: 'tagId',
            through: function () { return video_tag_1.VideoTagModel; },
            onDelete: 'CASCADE'
        })
    ], TagModel.prototype, "Videos");
    TagModel = TagModel_1 = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'tag',
            timestamps: false,
            indexes: [
                {
                    fields: ['name'],
                    unique: true
                }
            ]
        })
    ], TagModel);
    return TagModel;
}(sequelize_typescript_1.Model));
exports.TagModel = TagModel;
