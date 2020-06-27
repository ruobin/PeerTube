"use strict";
exports.__esModule = true;
var video_1 = require("./video");
var constants_1 = require("../../initializers/constants");
var video_caption_1 = require("./video-caption");
var activitypub_1 = require("../../lib/activitypub");
var misc_1 = require("../../helpers/custom-validators/misc");
function videoModelToFormattedJSON(video, options) {
    var userHistory = misc_1.isArray(video.UserVideoHistories) ? video.UserVideoHistories[0] : undefined;
    var videoObject = {
        id: video.id,
        uuid: video.uuid,
        name: video.name,
        category: {
            id: video.category,
            label: video_1.VideoModel.getCategoryLabel(video.category)
        },
        licence: {
            id: video.licence,
            label: video_1.VideoModel.getLicenceLabel(video.licence)
        },
        language: {
            id: video.language,
            label: video_1.VideoModel.getLanguageLabel(video.language)
        },
        privacy: {
            id: video.privacy,
            label: video_1.VideoModel.getPrivacyLabel(video.privacy)
        },
        nsfw: video.nsfw,
        description: options && options.completeDescription === true ? video.description : video.getTruncatedDescription(),
        isLocal: video.isOwned(),
        duration: video.duration,
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        thumbnailPath: video.getMiniatureStaticPath(),
        previewPath: video.getPreviewStaticPath(),
        embedPath: video.getEmbedStaticPath(),
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
        publishedAt: video.publishedAt,
        originallyPublishedAt: video.originallyPublishedAt,
        account: video.VideoChannel.Account.toFormattedSummaryJSON(),
        channel: video.VideoChannel.toFormattedSummaryJSON(),
        userHistory: userHistory ? {
            currentTime: userHistory.currentTime
        } : undefined
    };
    if (options) {
        if (options.additionalAttributes.state === true) {
            videoObject.state = {
                id: video.state,
                label: video_1.VideoModel.getStateLabel(video.state)
            };
        }
        if (options.additionalAttributes.waitTranscoding === true) {
            videoObject.waitTranscoding = video.waitTranscoding;
        }
        if (options.additionalAttributes.scheduledUpdate === true && video.ScheduleVideoUpdate) {
            videoObject.scheduledUpdate = {
                updateAt: video.ScheduleVideoUpdate.updateAt,
                privacy: video.ScheduleVideoUpdate.privacy || undefined
            };
        }
        if (options.additionalAttributes.blacklistInfo === true) {
            videoObject.blacklisted = !!video.VideoBlacklist;
            videoObject.blacklistedReason = video.VideoBlacklist ? video.VideoBlacklist.reason : null;
        }
    }
    return videoObject;
}
exports.videoModelToFormattedJSON = videoModelToFormattedJSON;
function videoModelToFormattedDetailsJSON(video) {
    var formattedJson = video.toFormattedJSON({
        additionalAttributes: {
            scheduledUpdate: true,
            blacklistInfo: true
        }
    });
    var _a = video.getBaseUrls(), baseUrlHttp = _a.baseUrlHttp, baseUrlWs = _a.baseUrlWs;
    var tags = video.Tags ? video.Tags.map(function (t) { return t.name; }) : [];
    var streamingPlaylists = streamingPlaylistsModelToFormattedJSON(video, video.VideoStreamingPlaylists);
    var detailsJson = {
        support: video.support,
        descriptionPath: video.getDescriptionAPIPath(),
        channel: video.VideoChannel.toFormattedJSON(),
        account: video.VideoChannel.Account.toFormattedJSON(),
        tags: tags,
        commentsEnabled: video.commentsEnabled,
        downloadEnabled: video.downloadEnabled,
        waitTranscoding: video.waitTranscoding,
        state: {
            id: video.state,
            label: video_1.VideoModel.getStateLabel(video.state)
        },
        trackerUrls: video.getTrackerUrls(baseUrlHttp, baseUrlWs),
        files: [],
        streamingPlaylists: streamingPlaylists
    };
    // Format and sort video files
    detailsJson.files = videoFilesModelToFormattedJSON(video, video.VideoFiles);
    return Object.assign(formattedJson, detailsJson);
}
exports.videoModelToFormattedDetailsJSON = videoModelToFormattedDetailsJSON;
function streamingPlaylistsModelToFormattedJSON(video, playlists) {
    if (misc_1.isArray(playlists) === false)
        return [];
    return playlists
        .map(function (playlist) {
        var redundancies = misc_1.isArray(playlist.RedundancyVideos)
            ? playlist.RedundancyVideos.map(function (r) { return ({ baseUrl: r.fileUrl }); })
            : [];
        return {
            id: playlist.id,
            type: playlist.type,
            playlistUrl: playlist.playlistUrl,
            segmentsSha256Url: playlist.segmentsSha256Url,
            redundancies: redundancies
        };
    });
}
function videoFilesModelToFormattedJSON(video, videoFiles) {
    var _a = video.getBaseUrls(), baseUrlHttp = _a.baseUrlHttp, baseUrlWs = _a.baseUrlWs;
    return videoFiles
        .map(function (videoFile) {
        var resolutionLabel = videoFile.resolution + 'p';
        return {
            resolution: {
                id: videoFile.resolution,
                label: resolutionLabel
            },
            magnetUri: video.generateMagnetUri(videoFile, baseUrlHttp, baseUrlWs),
            size: videoFile.size,
            fps: videoFile.fps,
            torrentUrl: video.getTorrentUrl(videoFile, baseUrlHttp),
            torrentDownloadUrl: video.getTorrentDownloadUrl(videoFile, baseUrlHttp),
            fileUrl: video.getVideoFileUrl(videoFile, baseUrlHttp),
            fileDownloadUrl: video.getVideoFileDownloadUrl(videoFile, baseUrlHttp)
        };
    })
        .sort(function (a, b) {
        if (a.resolution.id < b.resolution.id)
            return 1;
        if (a.resolution.id === b.resolution.id)
            return 0;
        return -1;
    });
}
exports.videoFilesModelToFormattedJSON = videoFilesModelToFormattedJSON;
function videoModelToActivityPubObject(video) {
    var _a = video.getBaseUrls(), baseUrlHttp = _a.baseUrlHttp, baseUrlWs = _a.baseUrlWs;
    if (!video.Tags)
        video.Tags = [];
    var tag = video.Tags.map(function (t) { return ({
        type: 'Hashtag',
        name: t.name
    }); });
    var language;
    if (video.language) {
        language = {
            identifier: video.language,
            name: video_1.VideoModel.getLanguageLabel(video.language)
        };
    }
    var category;
    if (video.category) {
        category = {
            identifier: video.category + '',
            name: video_1.VideoModel.getCategoryLabel(video.category)
        };
    }
    var licence;
    if (video.licence) {
        licence = {
            identifier: video.licence + '',
            name: video_1.VideoModel.getLicenceLabel(video.licence)
        };
    }
    var url = [];
    for (var _i = 0, _b = video.VideoFiles; _i < _b.length; _i++) {
        var file = _b[_i];
        url.push({
            type: 'Link',
            mimeType: constants_1.MIMETYPES.VIDEO.EXT_MIMETYPE[file.extname],
            mediaType: constants_1.MIMETYPES.VIDEO.EXT_MIMETYPE[file.extname],
            href: video.getVideoFileUrl(file, baseUrlHttp),
            height: file.resolution,
            size: file.size,
            fps: file.fps
        });
        url.push({
            type: 'Link',
            mimeType: 'application/x-bittorrent',
            mediaType: 'application/x-bittorrent',
            href: video.getTorrentUrl(file, baseUrlHttp),
            height: file.resolution
        });
        url.push({
            type: 'Link',
            mimeType: 'application/x-bittorrent;x-scheme-handler/magnet',
            mediaType: 'application/x-bittorrent;x-scheme-handler/magnet',
            href: video.generateMagnetUri(file, baseUrlHttp, baseUrlWs),
            height: file.resolution
        });
    }
    for (var _c = 0, _d = (video.VideoStreamingPlaylists || []); _c < _d.length; _c++) {
        var playlist = _d[_c];
        var tag_1 = void 0;
        tag_1 = playlist.p2pMediaLoaderInfohashes
            .map(function (i) { return ({ type: 'Infohash', name: i }); });
        tag_1.push({
            type: 'Link',
            name: 'sha256',
            mimeType: 'application/json',
            mediaType: 'application/json',
            href: playlist.segmentsSha256Url
        });
        url.push({
            type: 'Link',
            mimeType: 'application/x-mpegURL',
            mediaType: 'application/x-mpegURL',
            href: playlist.playlistUrl,
            tag: tag_1
        });
    }
    // Add video url too
    url.push({
        type: 'Link',
        mimeType: 'text/html',
        mediaType: 'text/html',
        href: constants_1.WEBSERVER.URL + '/videos/watch/' + video.uuid
    });
    var subtitleLanguage = [];
    for (var _e = 0, _f = video.VideoCaptions; _e < _f.length; _e++) {
        var caption = _f[_e];
        subtitleLanguage.push({
            identifier: caption.language,
            name: video_caption_1.VideoCaptionModel.getLanguageLabel(caption.language)
        });
    }
    var miniature = video.getMiniature();
    return {
        type: 'Video',
        id: video.url,
        name: video.name,
        duration: getActivityStreamDuration(video.duration),
        uuid: video.uuid,
        tag: tag,
        category: category,
        licence: licence,
        language: language,
        views: video.views,
        sensitive: video.nsfw,
        waitTranscoding: video.waitTranscoding,
        state: video.state,
        commentsEnabled: video.commentsEnabled,
        downloadEnabled: video.downloadEnabled,
        published: video.publishedAt.toISOString(),
        originallyPublishedAt: video.originallyPublishedAt ? video.originallyPublishedAt.toISOString() : null,
        updated: video.updatedAt.toISOString(),
        mediaType: 'text/markdown',
        content: video.getTruncatedDescription(),
        support: video.support,
        subtitleLanguage: subtitleLanguage,
        icon: {
            type: 'Image',
            url: miniature.getFileUrl(),
            mediaType: 'image/jpeg',
            width: miniature.width,
            height: miniature.height
        },
        url: url,
        likes: activitypub_1.getVideoLikesActivityPubUrl(video),
        dislikes: activitypub_1.getVideoDislikesActivityPubUrl(video),
        shares: activitypub_1.getVideoSharesActivityPubUrl(video),
        comments: activitypub_1.getVideoCommentsActivityPubUrl(video),
        attributedTo: [
            {
                type: 'Person',
                id: video.VideoChannel.Account.Actor.url
            },
            {
                type: 'Group',
                id: video.VideoChannel.Actor.url
            }
        ]
    };
}
exports.videoModelToActivityPubObject = videoModelToActivityPubObject;
function getActivityStreamDuration(duration) {
    // https://www.w3.org/TR/activitystreams-vocabulary/#dfn-duration
    return 'PT' + duration + 'S';
}
exports.getActivityStreamDuration = getActivityStreamDuration;
