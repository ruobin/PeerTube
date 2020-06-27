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
var i18n_1 = require("../../shared/models/i18n/i18n");
var constants_1 = require("../initializers/constants");
var path_1 = require("path");
var core_utils_1 = require("../helpers/core-utils");
var video_1 = require("../models/video/video");
var validator = require("validator");
var videos_1 = require("../../shared/models/videos");
var fs_extra_1 = require("fs-extra");
var video_format_utils_1 = require("../models/video/video-format-utils");
var account_1 = require("../models/account/account");
var video_channel_1 = require("../models/video/video-channel");
var config_1 = require("../initializers/config");
var logger_1 = require("../helpers/logger");
var ClientHtml = /** @class */ (function () {
    function ClientHtml() {
    }
    ClientHtml.invalidCache = function () {
        logger_1.logger.info('Cleaning HTML cache.');
        ClientHtml.htmlCache = {};
    };
    ClientHtml.getDefaultHTMLPage = function (req, res, paramLang) {
        return __awaiter(this, void 0, void 0, function () {
            var html, customHtml;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ClientHtml.getIndexHTML(req, res, paramLang)];
                    case 1:
                        html = _a.sent();
                        customHtml = ClientHtml.addTitleTag(html);
                        customHtml = ClientHtml.addDescriptionTag(customHtml);
                        return [2 /*return*/, customHtml];
                }
            });
        });
    };
    ClientHtml.getWatchHTMLPage = function (videoId, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, html, video, customHtml;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Let Angular application handle errors
                        if (!validator.isInt(videoId) && !validator.isUUID(videoId, 4)) {
                            return [2 /*return*/, ClientHtml.getIndexHTML(req, res)];
                        }
                        return [4 /*yield*/, Promise.all([
                                ClientHtml.getIndexHTML(req, res),
                                video_1.VideoModel.load(videoId)
                            ])
                            // Let Angular application handle errors
                        ];
                    case 1:
                        _a = _b.sent(), html = _a[0], video = _a[1];
                        // Let Angular application handle errors
                        if (!video || video.privacy === videos_1.VideoPrivacy.PRIVATE) {
                            return [2 /*return*/, ClientHtml.getIndexHTML(req, res)];
                        }
                        customHtml = ClientHtml.addTitleTag(html, core_utils_1.escapeHTML(video.name));
                        customHtml = ClientHtml.addDescriptionTag(customHtml, core_utils_1.escapeHTML(video.description));
                        customHtml = ClientHtml.addVideoOpenGraphAndOEmbedTags(customHtml, video);
                        return [2 /*return*/, customHtml];
                }
            });
        });
    };
    ClientHtml.getAccountHTMLPage = function (nameWithHost, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getAccountOrChannelHTMLPage(function () { return account_1.AccountModel.loadByNameWithHost(nameWithHost); }, req, res)];
            });
        });
    };
    ClientHtml.getVideoChannelHTMLPage = function (nameWithHost, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getAccountOrChannelHTMLPage(function () { return video_channel_1.VideoChannelModel.loadByNameWithHostAndPopulateAccount(nameWithHost); }, req, res)];
            });
        });
    };
    ClientHtml.getAccountOrChannelHTMLPage = function (loader, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, html, entity, customHtml;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            ClientHtml.getIndexHTML(req, res),
                            loader()
                        ])
                        // Let Angular application handle errors
                    ];
                    case 1:
                        _a = _b.sent(), html = _a[0], entity = _a[1];
                        // Let Angular application handle errors
                        if (!entity) {
                            return [2 /*return*/, ClientHtml.getIndexHTML(req, res)];
                        }
                        customHtml = ClientHtml.addTitleTag(html, core_utils_1.escapeHTML(entity.getDisplayName()));
                        customHtml = ClientHtml.addDescriptionTag(customHtml, core_utils_1.escapeHTML(entity.description));
                        customHtml = ClientHtml.addAccountOrChannelMetaTags(customHtml, entity);
                        return [2 /*return*/, customHtml];
                }
            });
        });
    };
    ClientHtml.getIndexHTML = function (req, res, paramLang) {
        return __awaiter(this, void 0, void 0, function () {
            var path, buffer, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = ClientHtml.getIndexPath(req, res, paramLang);
                        if (ClientHtml.htmlCache[path])
                            return [2 /*return*/, ClientHtml.htmlCache[path]];
                        return [4 /*yield*/, fs_extra_1.readFile(path)];
                    case 1:
                        buffer = _a.sent();
                        html = buffer.toString();
                        html = ClientHtml.addCustomCSS(html);
                        return [4 /*yield*/, ClientHtml.addAsyncPluginCSS(html)];
                    case 2:
                        html = _a.sent();
                        ClientHtml.htmlCache[path] = html;
                        return [2 /*return*/, html];
                }
            });
        });
    };
    ClientHtml.getIndexPath = function (req, res, paramLang) {
        var lang;
        // Check param lang validity
        if (paramLang && i18n_1.is18nLocale(paramLang)) {
            lang = paramLang;
            // Save locale in cookies
            res.cookie('clientLanguage', lang, {
                secure: constants_1.WEBSERVER.SCHEME === 'https',
                sameSite: true,
                maxAge: 1000 * 3600 * 24 * 90 // 3 months
            });
        }
        else if (req.cookies.clientLanguage && i18n_1.is18nLocale(req.cookies.clientLanguage)) {
            lang = req.cookies.clientLanguage;
        }
        else {
            lang = req.acceptsLanguages(i18n_1.POSSIBLE_LOCALES) || i18n_1.getDefaultLocale();
        }
        return path_1.join(__dirname, '../../../client/dist/' + i18n_1.buildFileLocale(lang) + '/index.html');
    };
    ClientHtml.addTitleTag = function (htmlStringPage, title) {
        var text = title || config_1.CONFIG.INSTANCE.NAME;
        if (title)
            text += " - " + config_1.CONFIG.INSTANCE.NAME;
        var titleTag = "<title>" + text + "</title>";
        return htmlStringPage.replace(constants_1.CUSTOM_HTML_TAG_COMMENTS.TITLE, titleTag);
    };
    ClientHtml.addDescriptionTag = function (htmlStringPage, description) {
        var content = description || config_1.CONFIG.INSTANCE.SHORT_DESCRIPTION;
        var descriptionTag = "<meta name=\"description\" content=\"" + content + "\" />";
        return htmlStringPage.replace(constants_1.CUSTOM_HTML_TAG_COMMENTS.DESCRIPTION, descriptionTag);
    };
    ClientHtml.addCustomCSS = function (htmlStringPage) {
        var styleTag = "<style class=\"custom-css-style\">" + config_1.CONFIG.INSTANCE.CUSTOMIZATIONS.CSS + "</style>";
        return htmlStringPage.replace(constants_1.CUSTOM_HTML_TAG_COMMENTS.CUSTOM_CSS, styleTag);
    };
    ClientHtml.addAsyncPluginCSS = function (htmlStringPage) {
        return __awaiter(this, void 0, void 0, function () {
            var globalCSSContent, fileHash, linkTag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs_extra_1.readFile(constants_1.PLUGIN_GLOBAL_CSS_PATH)];
                    case 1:
                        globalCSSContent = _a.sent();
                        if (globalCSSContent.byteLength === 0)
                            return [2 /*return*/, htmlStringPage];
                        fileHash = core_utils_1.sha256(globalCSSContent);
                        linkTag = "<link rel=\"stylesheet\" href=\"/plugins/global.css?hash=" + fileHash + "\" />";
                        return [2 /*return*/, htmlStringPage.replace('</head>', linkTag + '</head>')];
                }
            });
        });
    };
    ClientHtml.addVideoOpenGraphAndOEmbedTags = function (htmlStringPage, video) {
        var previewUrl = constants_1.WEBSERVER.URL + video.getPreviewStaticPath();
        var videoUrl = constants_1.WEBSERVER.URL + video.getWatchStaticPath();
        var videoNameEscaped = core_utils_1.escapeHTML(video.name);
        var videoDescriptionEscaped = core_utils_1.escapeHTML(video.description);
        var embedUrl = constants_1.WEBSERVER.URL + video.getEmbedStaticPath();
        var openGraphMetaTags = {
            'og:type': 'video',
            'og:title': videoNameEscaped,
            'og:image': previewUrl,
            'og:url': videoUrl,
            'og:description': videoDescriptionEscaped,
            'og:video:url': embedUrl,
            'og:video:secure_url': embedUrl,
            'og:video:type': 'text/html',
            'og:video:width': constants_1.EMBED_SIZE.width,
            'og:video:height': constants_1.EMBED_SIZE.height,
            'name': videoNameEscaped,
            'description': videoDescriptionEscaped,
            'image': previewUrl,
            'twitter:card': config_1.CONFIG.SERVICES.TWITTER.WHITELISTED ? 'player' : 'summary_large_image',
            'twitter:site': config_1.CONFIG.SERVICES.TWITTER.USERNAME,
            'twitter:title': videoNameEscaped,
            'twitter:description': videoDescriptionEscaped,
            'twitter:image': previewUrl,
            'twitter:player': embedUrl,
            'twitter:player:width': constants_1.EMBED_SIZE.width,
            'twitter:player:height': constants_1.EMBED_SIZE.height
        };
        var oembedLinkTags = [
            {
                type: 'application/json+oembed',
                href: constants_1.WEBSERVER.URL + '/services/oembed?url=' + encodeURIComponent(videoUrl),
                title: videoNameEscaped
            }
        ];
        var schemaTags = {
            '@context': 'http://schema.org',
            '@type': 'VideoObject',
            name: videoNameEscaped,
            description: videoDescriptionEscaped,
            thumbnailUrl: previewUrl,
            uploadDate: video.createdAt.toISOString(),
            duration: video_format_utils_1.getActivityStreamDuration(video.duration),
            contentUrl: videoUrl,
            embedUrl: embedUrl,
            interactionCount: video.views
        };
        var tagsString = '';
        // Opengraph
        Object.keys(openGraphMetaTags).forEach(function (tagName) {
            var tagValue = openGraphMetaTags[tagName];
            tagsString += "<meta property=\"" + tagName + "\" content=\"" + tagValue + "\" />";
        });
        // OEmbed
        for (var _i = 0, oembedLinkTags_1 = oembedLinkTags; _i < oembedLinkTags_1.length; _i++) {
            var oembedLinkTag = oembedLinkTags_1[_i];
            tagsString += "<link rel=\"alternate\" type=\"" + oembedLinkTag.type + "\" href=\"" + oembedLinkTag.href + "\" title=\"" + oembedLinkTag.title + "\" />";
        }
        // Schema.org
        tagsString += "<script type=\"application/ld+json\">" + JSON.stringify(schemaTags) + "</script>";
        // SEO, use origin video url so Google does not index remote videos
        tagsString += "<link rel=\"canonical\" href=\"" + video.url + "\" />";
        return this.addOpenGraphAndOEmbedTags(htmlStringPage, tagsString);
    };
    ClientHtml.addAccountOrChannelMetaTags = function (htmlStringPage, entity) {
        // SEO, use origin account or channel URL
        var metaTags = "<link rel=\"canonical\" href=\"" + entity.Actor.url + "\" />";
        return this.addOpenGraphAndOEmbedTags(htmlStringPage, metaTags);
    };
    ClientHtml.addOpenGraphAndOEmbedTags = function (htmlStringPage, metaTags) {
        return htmlStringPage.replace(constants_1.CUSTOM_HTML_TAG_COMMENTS.META_TAGS, metaTags);
    };
    ClientHtml.htmlCache = {};
    return ClientHtml;
}());
exports.ClientHtml = ClientHtml;
