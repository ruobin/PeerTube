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
var tag_1 = require("./tag");
var video_1 = require("./video");
var VideoTagModel = /** @class */ (function (_super) {
    __extends(VideoTagModel, _super);
    function VideoTagModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], VideoTagModel.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], VideoTagModel.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return video_1.VideoModel; }),
        sequelize_typescript_1.Column
    ], VideoTagModel.prototype, "videoId");
    __decorate([
        sequelize_typescript_1.ForeignKey(function () { return tag_1.TagModel; }),
        sequelize_typescript_1.Column
    ], VideoTagModel.prototype, "tagId");
    VideoTagModel = __decorate([
        sequelize_typescript_1.Table({
            tableName: 'videoTag',
            indexes: [
                {
                    fields: ['videoId']
                },
                {
                    fields: ['tagId']
                }
            ]
        })
    ], VideoTagModel);
    return VideoTagModel;
}(sequelize_typescript_1.Model));
exports.VideoTagModel = VideoTagModel;
