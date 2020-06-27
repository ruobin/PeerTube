"use strict";
exports.__esModule = true;
var _a, _b, _c, _d, _e, _f;
var path_1 = require("path");
var models_1 = require("../../shared/models");
var videos_1 = require("../../shared/models/videos");
// Do not use barrels, remain constants as independent as possible
var core_utils_1 = require("../helpers/core-utils");
var lodash_1 = require("lodash");
var video_playlist_privacy_model_1 = require("../../shared/models/videos/playlist/video-playlist-privacy.model");
var video_playlist_type_model_1 = require("../../shared/models/videos/playlist/video-playlist-type.model");
var config_1 = require("./config");
// ---------------------------------------------------------------------------
var LAST_MIGRATION_VERSION = 420;
exports.LAST_MIGRATION_VERSION = LAST_MIGRATION_VERSION;
// ---------------------------------------------------------------------------
var API_VERSION = 'v1';
exports.API_VERSION = API_VERSION;
var PEERTUBE_VERSION = require(path_1.join(core_utils_1.root(), 'package.json')).version;
exports.PEERTUBE_VERSION = PEERTUBE_VERSION;
var PAGINATION = {
    COUNT: {
        DEFAULT: 15,
        MAX: 100
    }
};
exports.PAGINATION = PAGINATION;
var WEBSERVER = {
    URL: '',
    HOST: '',
    SCHEME: '',
    WS: '',
    HOSTNAME: '',
    PORT: 0
};
exports.WEBSERVER = WEBSERVER;
// Sortable columns per schema
var SORTABLE_COLUMNS = {
    USERS: ['id', 'username', 'videoQuotaUsed', 'createdAt'],
    USER_SUBSCRIPTIONS: ['id', 'createdAt'],
    ACCOUNTS: ['createdAt'],
    JOBS: ['createdAt'],
    VIDEO_ABUSES: ['id', 'createdAt', 'state'],
    VIDEO_CHANNELS: ['id', 'name', 'updatedAt', 'createdAt'],
    VIDEO_IMPORTS: ['createdAt'],
    VIDEO_COMMENT_THREADS: ['createdAt'],
    VIDEO_RATES: ['createdAt'],
    BLACKLISTS: ['id', 'name', 'duration', 'views', 'likes', 'dislikes', 'uuid', 'createdAt'],
    FOLLOWERS: ['createdAt'],
    FOLLOWING: ['createdAt'],
    VIDEOS: ['name', 'duration', 'createdAt', 'publishedAt', 'views', 'likes', 'trending'],
    VIDEOS_SEARCH: ['name', 'duration', 'createdAt', 'publishedAt', 'views', 'likes', 'match'],
    VIDEO_CHANNELS_SEARCH: ['match', 'displayName', 'createdAt'],
    ACCOUNTS_BLOCKLIST: ['createdAt'],
    SERVERS_BLOCKLIST: ['createdAt'],
    USER_NOTIFICATIONS: ['createdAt'],
    VIDEO_PLAYLISTS: ['displayName', 'createdAt', 'updatedAt'],
    PLUGINS: ['name', 'createdAt', 'updatedAt'],
    AVAILABLE_PLUGINS: ['npmName', 'popularity']
};
exports.SORTABLE_COLUMNS = SORTABLE_COLUMNS;
var OAUTH_LIFETIME = {
    ACCESS_TOKEN: 3600 * 24,
    REFRESH_TOKEN: 1209600 // 2 weeks
};
exports.OAUTH_LIFETIME = OAUTH_LIFETIME;
var ROUTE_CACHE_LIFETIME = {
    FEEDS: '15 minutes',
    ROBOTS: '2 hours',
    SITEMAP: '1 day',
    SECURITYTXT: '2 hours',
    NODEINFO: '10 minutes',
    DNT_POLICY: '1 week',
    OVERVIEWS: {
        VIDEOS: '1 hour'
    },
    ACTIVITY_PUB: {
        VIDEOS: '1 second' // 1 second, cache concurrent requests after a broadcast for example
    },
    STATS: '4 hours'
};
exports.ROUTE_CACHE_LIFETIME = ROUTE_CACHE_LIFETIME;
// ---------------------------------------------------------------------------
// Number of points we add/remove after a successful/bad request
var ACTOR_FOLLOW_SCORE = {
    PENALTY: -10,
    BONUS: 10,
    BASE: 1000,
    MAX: 10000
};
exports.ACTOR_FOLLOW_SCORE = ACTOR_FOLLOW_SCORE;
var FOLLOW_STATES = {
    PENDING: 'pending',
    ACCEPTED: 'accepted'
};
exports.FOLLOW_STATES = FOLLOW_STATES;
var REMOTE_SCHEME = {
    HTTP: 'https',
    WS: 'wss'
};
exports.REMOTE_SCHEME = REMOTE_SCHEME;
// TODO: remove 'video-file'
var JOB_ATTEMPTS = {
    'activitypub-http-broadcast': 5,
    'activitypub-http-unicast': 5,
    'activitypub-http-fetcher': 5,
    'activitypub-follow': 5,
    'video-file-import': 1,
    'video-transcoding': 1,
    'video-file': 1,
    'video-import': 1,
    'email': 5,
    'videos-views': 1,
    'activitypub-refresher': 1
};
exports.JOB_ATTEMPTS = JOB_ATTEMPTS;
var JOB_CONCURRENCY = {
    'activitypub-http-broadcast': 1,
    'activitypub-http-unicast': 5,
    'activitypub-http-fetcher': 1,
    'activitypub-follow': 3,
    'video-file-import': 1,
    'video-transcoding': 1,
    'video-file': 1,
    'video-import': 1,
    'email': 5,
    'videos-views': 1,
    'activitypub-refresher': 1
};
exports.JOB_CONCURRENCY = JOB_CONCURRENCY;
var JOB_TTL = {
    'activitypub-http-broadcast': 60000 * 10,
    'activitypub-http-unicast': 60000 * 10,
    'activitypub-http-fetcher': 60000 * 10,
    'activitypub-follow': 60000 * 10,
    'video-file-import': 1000 * 3600,
    'video-transcoding': 1000 * 3600 * 48,
    'video-file': 1000 * 3600 * 48,
    'video-import': 1000 * 3600 * 2,
    'email': 60000 * 10,
    'videos-views': undefined,
    'activitypub-refresher': 60000 * 10 // 10 minutes
};
exports.JOB_TTL = JOB_TTL;
var REPEAT_JOBS = {
    'videos-views': {
        cron: '1 * * * *' // At 1 minute past the hour
    }
};
exports.REPEAT_JOBS = REPEAT_JOBS;
var BROADCAST_CONCURRENCY = 10; // How many requests in parallel we do in activitypub-http-broadcast job
exports.BROADCAST_CONCURRENCY = BROADCAST_CONCURRENCY;
var CRAWL_REQUEST_CONCURRENCY = 1; // How many requests in parallel to fetch remote data (likes, shares...)
exports.CRAWL_REQUEST_CONCURRENCY = CRAWL_REQUEST_CONCURRENCY;
var JOB_REQUEST_TIMEOUT = 3000; // 3 seconds
exports.JOB_REQUEST_TIMEOUT = JOB_REQUEST_TIMEOUT;
var JOB_COMPLETED_LIFETIME = 60000 * 60 * 24 * 2; // 2 days
exports.JOB_COMPLETED_LIFETIME = JOB_COMPLETED_LIFETIME;
var VIDEO_IMPORT_TIMEOUT = 1000 * 3600; // 1 hour
exports.VIDEO_IMPORT_TIMEOUT = VIDEO_IMPORT_TIMEOUT;
var SCHEDULER_INTERVALS_MS = {
    actorFollowScores: 60000 * 60,
    removeOldJobs: 60000 * 60,
    updateVideos: 60000,
    youtubeDLUpdate: 60000 * 60 * 24,
    checkPlugins: config_1.CONFIG.PLUGINS.INDEX.CHECK_LATEST_VERSIONS_INTERVAL,
    removeOldViews: 60000 * 60 * 24,
    removeOldHistory: 60000 * 60 * 24 // 1 day
};
exports.SCHEDULER_INTERVALS_MS = SCHEDULER_INTERVALS_MS;
// ---------------------------------------------------------------------------
var CONSTRAINTS_FIELDS = {
    USERS: {
        NAME: { min: 1, max: 120 },
        DESCRIPTION: { min: 3, max: 1000 },
        USERNAME: { min: 1, max: 50 },
        PASSWORD: { min: 6, max: 255 },
        VIDEO_QUOTA: { min: -1 },
        VIDEO_QUOTA_DAILY: { min: -1 },
        VIDEO_LANGUAGES: { max: 500 },
        BLOCKED_REASON: { min: 3, max: 250 } // Length
    },
    VIDEO_ABUSES: {
        REASON: { min: 2, max: 3000 },
        MODERATION_COMMENT: { min: 2, max: 3000 } // Length
    },
    VIDEO_BLACKLIST: {
        REASON: { min: 2, max: 300 } // Length
    },
    VIDEO_CHANNELS: {
        NAME: { min: 1, max: 120 },
        DESCRIPTION: { min: 3, max: 1000 },
        SUPPORT: { min: 3, max: 1000 },
        URL: { min: 3, max: 2000 } // Length
    },
    VIDEO_CAPTIONS: {
        CAPTION_FILE: {
            EXTNAME: ['.vtt', '.srt'],
            FILE_SIZE: {
                max: 2 * 1024 * 1024 // 2MB
            }
        }
    },
    VIDEO_IMPORTS: {
        URL: { min: 3, max: 2000 },
        TORRENT_NAME: { min: 3, max: 255 },
        TORRENT_FILE: {
            EXTNAME: ['.torrent'],
            FILE_SIZE: {
                max: 1024 * 200 // 200 KB
            }
        }
    },
    VIDEOS_REDUNDANCY: {
        URL: { min: 3, max: 2000 } // Length
    },
    VIDEO_RATES: {
        URL: { min: 3, max: 2000 } // Length
    },
    VIDEOS: {
        NAME: { min: 3, max: 120 },
        LANGUAGE: { min: 1, max: 10 },
        TRUNCATED_DESCRIPTION: { min: 3, max: 250 },
        DESCRIPTION: { min: 3, max: 10000 },
        SUPPORT: { min: 3, max: 1000 },
        IMAGE: {
            EXTNAME: ['.jpg', '.jpeg'],
            FILE_SIZE: {
                max: 2 * 1024 * 1024 // 2MB
            }
        },
        EXTNAME: [],
        INFO_HASH: { min: 40, max: 40 },
        DURATION: { min: 0 },
        TAGS: { min: 0, max: 5 },
        TAG: { min: 2, max: 30 },
        THUMBNAIL: { min: 2, max: 30 },
        THUMBNAIL_DATA: { min: 0, max: 20000 },
        VIEWS: { min: 0 },
        LIKES: { min: 0 },
        DISLIKES: { min: 0 },
        FILE_SIZE: { min: 10 },
        URL: { min: 3, max: 2000 } // Length
    },
    VIDEO_PLAYLISTS: {
        NAME: { min: 1, max: 120 },
        DESCRIPTION: { min: 3, max: 1000 },
        URL: { min: 3, max: 2000 },
        IMAGE: {
            EXTNAME: ['.jpg', '.jpeg'],
            FILE_SIZE: {
                max: 2 * 1024 * 1024 // 2MB
            }
        }
    },
    ACTORS: {
        PUBLIC_KEY: { min: 10, max: 5000 },
        PRIVATE_KEY: { min: 10, max: 5000 },
        URL: { min: 3, max: 2000 },
        AVATAR: {
            EXTNAME: ['.png', '.jpeg', '.jpg'],
            FILE_SIZE: {
                max: 2 * 1024 * 1024 // 2MB
            }
        }
    },
    VIDEO_EVENTS: {
        COUNT: { min: 0 }
    },
    VIDEO_COMMENTS: {
        TEXT: { min: 1, max: 3000 },
        URL: { min: 3, max: 2000 } // Length
    },
    VIDEO_SHARE: {
        URL: { min: 3, max: 2000 } // Length
    },
    CONTACT_FORM: {
        FROM_NAME: { min: 1, max: 120 },
        BODY: { min: 3, max: 5000 } // Length
    },
    PLUGINS: {
        NAME: { min: 1, max: 214 },
        DESCRIPTION: { min: 1, max: 20000 } // Length
    }
};
exports.CONSTRAINTS_FIELDS = CONSTRAINTS_FIELDS;
var VIDEO_VIEW_LIFETIME = 60000 * 60; // 1 hour
exports.VIDEO_VIEW_LIFETIME = VIDEO_VIEW_LIFETIME;
var CONTACT_FORM_LIFETIME = 60000 * 60; // 1 hour
exports.CONTACT_FORM_LIFETIME = CONTACT_FORM_LIFETIME;
var VIDEO_TRANSCODING_FPS = {
    MIN: 10,
    AVERAGE: 30,
    MAX: 60,
    KEEP_ORIGIN_FPS_RESOLUTION_MIN: 720 // We keep the original FPS on high resolutions (720 minimum)
};
exports.VIDEO_TRANSCODING_FPS = VIDEO_TRANSCODING_FPS;
var DEFAULT_AUDIO_RESOLUTION = models_1.VideoResolution.H_480P;
exports.DEFAULT_AUDIO_RESOLUTION = DEFAULT_AUDIO_RESOLUTION;
var VIDEO_RATE_TYPES = {
    LIKE: 'like',
    DISLIKE: 'dislike'
};
exports.VIDEO_RATE_TYPES = VIDEO_RATE_TYPES;
var FFMPEG_NICE = {
    THUMBNAIL: 2,
    TRANSCODING: 15
};
exports.FFMPEG_NICE = FFMPEG_NICE;
var VIDEO_CATEGORIES = {
    1: 'Music',
    2: 'Films',
    3: 'Vehicles',
    4: 'Art',
    5: 'Sports',
    6: 'Travels',
    7: 'Gaming',
    8: 'People',
    9: 'Comedy',
    10: 'Entertainment',
    11: 'News & Politics',
    12: 'How To',
    13: 'Education',
    14: 'Activism',
    15: 'Science & Technology',
    16: 'Animals',
    17: 'Kids',
    18: 'Food'
};
exports.VIDEO_CATEGORIES = VIDEO_CATEGORIES;
// See https://creativecommons.org/licenses/?lang=en
var VIDEO_LICENCES = {
    1: 'Attribution',
    2: 'Attribution - Share Alike',
    3: 'Attribution - No Derivatives',
    4: 'Attribution - Non Commercial',
    5: 'Attribution - Non Commercial - Share Alike',
    6: 'Attribution - Non Commercial - No Derivatives',
    7: 'Public Domain Dedication'
};
exports.VIDEO_LICENCES = VIDEO_LICENCES;
var VIDEO_LANGUAGES = {};
exports.VIDEO_LANGUAGES = VIDEO_LANGUAGES;
var VIDEO_PRIVACIES = (_a = {},
    _a[videos_1.VideoPrivacy.PUBLIC] = 'Public',
    _a[videos_1.VideoPrivacy.UNLISTED] = 'Unlisted',
    _a[videos_1.VideoPrivacy.PRIVATE] = 'Private',
    _a);
exports.VIDEO_PRIVACIES = VIDEO_PRIVACIES;
var VIDEO_STATES = (_b = {},
    _b[models_1.VideoState.PUBLISHED] = 'Published',
    _b[models_1.VideoState.TO_TRANSCODE] = 'To transcode',
    _b[models_1.VideoState.TO_IMPORT] = 'To import',
    _b);
exports.VIDEO_STATES = VIDEO_STATES;
var VIDEO_IMPORT_STATES = (_c = {},
    _c[videos_1.VideoImportState.FAILED] = 'Failed',
    _c[videos_1.VideoImportState.PENDING] = 'Pending',
    _c[videos_1.VideoImportState.SUCCESS] = 'Success',
    _c);
exports.VIDEO_IMPORT_STATES = VIDEO_IMPORT_STATES;
var VIDEO_ABUSE_STATES = (_d = {},
    _d[videos_1.VideoAbuseState.PENDING] = 'Pending',
    _d[videos_1.VideoAbuseState.REJECTED] = 'Rejected',
    _d[videos_1.VideoAbuseState.ACCEPTED] = 'Accepted',
    _d);
exports.VIDEO_ABUSE_STATES = VIDEO_ABUSE_STATES;
var VIDEO_PLAYLIST_PRIVACIES = (_e = {},
    _e[video_playlist_privacy_model_1.VideoPlaylistPrivacy.PUBLIC] = 'Public',
    _e[video_playlist_privacy_model_1.VideoPlaylistPrivacy.UNLISTED] = 'Unlisted',
    _e[video_playlist_privacy_model_1.VideoPlaylistPrivacy.PRIVATE] = 'Private',
    _e);
exports.VIDEO_PLAYLIST_PRIVACIES = VIDEO_PLAYLIST_PRIVACIES;
var VIDEO_PLAYLIST_TYPES = (_f = {},
    _f[video_playlist_type_model_1.VideoPlaylistType.REGULAR] = 'Regular',
    _f[video_playlist_type_model_1.VideoPlaylistType.WATCH_LATER] = 'Watch later',
    _f);
exports.VIDEO_PLAYLIST_TYPES = VIDEO_PLAYLIST_TYPES;
var MIMETYPES = {
    AUDIO: {
        MIMETYPE_EXT: {
            'audio/mpeg': '.mp3',
            'audio/mp3': '.mp3',
            'application/ogg': '.ogg',
            'audio/ogg': '.ogg',
            'audio/flac': '.flac'
        },
        EXT_MIMETYPE: null
    },
    VIDEO: {
        MIMETYPE_EXT: null,
        EXT_MIMETYPE: null
    },
    IMAGE: {
        MIMETYPE_EXT: {
            'image/png': '.png',
            'image/jpg': '.jpg',
            'image/jpeg': '.jpg'
        }
    },
    VIDEO_CAPTIONS: {
        MIMETYPE_EXT: {
            'text/vtt': '.vtt',
            'application/x-subrip': '.srt'
        }
    },
    TORRENT: {
        MIMETYPE_EXT: {
            'application/x-bittorrent': '.torrent'
        }
    }
};
exports.MIMETYPES = MIMETYPES;
MIMETYPES.AUDIO.EXT_MIMETYPE = lodash_1.invert(MIMETYPES.AUDIO.MIMETYPE_EXT);
// ---------------------------------------------------------------------------
var OVERVIEWS = {
    VIDEOS: {
        SAMPLE_THRESHOLD: 6,
        SAMPLES_COUNT: 2
    }
};
exports.OVERVIEWS = OVERVIEWS;
// ---------------------------------------------------------------------------
var SERVER_ACTOR_NAME = 'peertube';
exports.SERVER_ACTOR_NAME = SERVER_ACTOR_NAME;
var ACTIVITY_PUB = {
    POTENTIAL_ACCEPT_HEADERS: [
        'application/activity+json',
        'application/ld+json',
        'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
    ],
    ACCEPT_HEADER: 'application/activity+json, application/ld+json',
    PUBLIC: 'https://www.w3.org/ns/activitystreams#Public',
    COLLECTION_ITEMS_PER_PAGE: 10,
    FETCH_PAGE_LIMIT: 100,
    URL_MIME_TYPES: {
        VIDEO: [],
        TORRENT: ['application/x-bittorrent'],
        MAGNET: ['application/x-bittorrent;x-scheme-handler/magnet']
    },
    MAX_RECURSION_COMMENTS: 100,
    ACTOR_REFRESH_INTERVAL: 3600 * 24 * 1000 * 2,
    VIDEO_REFRESH_INTERVAL: 3600 * 24 * 1000 * 2,
    VIDEO_PLAYLIST_REFRESH_INTERVAL: 3600 * 24 * 1000 * 2 // 2 days
};
exports.ACTIVITY_PUB = ACTIVITY_PUB;
var ACTIVITY_PUB_ACTOR_TYPES = {
    GROUP: 'Group',
    PERSON: 'Person',
    APPLICATION: 'Application'
};
exports.ACTIVITY_PUB_ACTOR_TYPES = ACTIVITY_PUB_ACTOR_TYPES;
var HTTP_SIGNATURE = {
    HEADER_NAME: 'signature',
    ALGORITHM: 'rsa-sha256',
    HEADERS_TO_SIGN: ['(request-target)', 'host', 'date', 'digest']
};
exports.HTTP_SIGNATURE = HTTP_SIGNATURE;
// ---------------------------------------------------------------------------
var PRIVATE_RSA_KEY_SIZE = 2048;
exports.PRIVATE_RSA_KEY_SIZE = PRIVATE_RSA_KEY_SIZE;
// Password encryption
var BCRYPT_SALT_SIZE = 10;
exports.BCRYPT_SALT_SIZE = BCRYPT_SALT_SIZE;
var USER_PASSWORD_RESET_LIFETIME = 60000 * 5; // 5 minutes
exports.USER_PASSWORD_RESET_LIFETIME = USER_PASSWORD_RESET_LIFETIME;
var USER_EMAIL_VERIFY_LIFETIME = 60000 * 60; // 60 minutes
exports.USER_EMAIL_VERIFY_LIFETIME = USER_EMAIL_VERIFY_LIFETIME;
var NSFW_POLICY_TYPES = {
    DO_NOT_LIST: 'do_not_list',
    BLUR: 'blur',
    DISPLAY: 'display'
};
exports.NSFW_POLICY_TYPES = NSFW_POLICY_TYPES;
// ---------------------------------------------------------------------------
// Express static paths (router)
var STATIC_PATHS = {
    PREVIEWS: '/static/previews/',
    THUMBNAILS: '/static/thumbnails/',
    TORRENTS: '/static/torrents/',
    WEBSEED: '/static/webseed/',
    REDUNDANCY: '/static/redundancy/',
    STREAMING_PLAYLISTS: {
        HLS: '/static/streaming-playlists/hls'
    },
    AVATARS: '/static/avatars/',
    VIDEO_CAPTIONS: '/static/video-captions/'
};
exports.STATIC_PATHS = STATIC_PATHS;
var STATIC_DOWNLOAD_PATHS = {
    TORRENTS: '/download/torrents/',
    VIDEOS: '/download/videos/'
};
exports.STATIC_DOWNLOAD_PATHS = STATIC_DOWNLOAD_PATHS;
var LAZY_STATIC_PATHS = {
    AVATARS: '/lazy-static/avatars/',
    PREVIEWS: '/static/previews/',
    VIDEO_CAPTIONS: '/static/video-captions/'
};
exports.LAZY_STATIC_PATHS = LAZY_STATIC_PATHS;
// Cache control
var STATIC_MAX_AGE = {
    SERVER: '2h',
    CLIENT: '30d'
};
exports.STATIC_MAX_AGE = STATIC_MAX_AGE;
// Videos thumbnail size
var THUMBNAILS_SIZE = {
    width: 223,
    height: 122
};
exports.THUMBNAILS_SIZE = THUMBNAILS_SIZE;
var PREVIEWS_SIZE = {
    width: 850,
    height: 480
};
exports.PREVIEWS_SIZE = PREVIEWS_SIZE;
var AVATARS_SIZE = {
    width: 120,
    height: 120
};
exports.AVATARS_SIZE = AVATARS_SIZE;
var EMBED_SIZE = {
    width: 560,
    height: 315
};
exports.EMBED_SIZE = EMBED_SIZE;
// Sub folders of cache directory
var FILES_CACHE = {
    PREVIEWS: {
        DIRECTORY: path_1.join(config_1.CONFIG.STORAGE.CACHE_DIR, 'previews'),
        MAX_AGE: 1000 * 3600 * 3 // 3 hours
    },
    VIDEO_CAPTIONS: {
        DIRECTORY: path_1.join(config_1.CONFIG.STORAGE.CACHE_DIR, 'video-captions'),
        MAX_AGE: 1000 * 3600 * 3 // 3 hours
    }
};
exports.FILES_CACHE = FILES_CACHE;
var LRU_CACHE = {
    USER_TOKENS: {
        MAX_SIZE: 1000
    },
    AVATAR_STATIC: {
        MAX_SIZE: 500
    }
};
exports.LRU_CACHE = LRU_CACHE;
var HLS_STREAMING_PLAYLIST_DIRECTORY = path_1.join(config_1.CONFIG.STORAGE.STREAMING_PLAYLISTS_DIR, 'hls');
exports.HLS_STREAMING_PLAYLIST_DIRECTORY = HLS_STREAMING_PLAYLIST_DIRECTORY;
var HLS_REDUNDANCY_DIRECTORY = path_1.join(config_1.CONFIG.STORAGE.REDUNDANCY_DIR, 'hls');
exports.HLS_REDUNDANCY_DIRECTORY = HLS_REDUNDANCY_DIRECTORY;
var MEMOIZE_TTL = {
    OVERVIEWS_SAMPLE: 1000 * 3600 * 4 // 4 hours
};
exports.MEMOIZE_TTL = MEMOIZE_TTL;
var QUEUE_CONCURRENCY = {
    AVATAR_PROCESS_IMAGE: 3
};
exports.QUEUE_CONCURRENCY = QUEUE_CONCURRENCY;
var REDUNDANCY = {
    VIDEOS: {
        RANDOMIZED_FACTOR: 5
    }
};
exports.REDUNDANCY = REDUNDANCY;
var ACCEPT_HEADERS = ['html', 'application/json'].concat(ACTIVITY_PUB.POTENTIAL_ACCEPT_HEADERS);
exports.ACCEPT_HEADERS = ACCEPT_HEADERS;
var ASSETS_PATH = {
    DEFAULT_AUDIO_BACKGROUND: path_1.join(core_utils_1.root(), 'server', 'assets', 'default-audio-background.jpg')
};
exports.ASSETS_PATH = ASSETS_PATH;
// ---------------------------------------------------------------------------
var CUSTOM_HTML_TAG_COMMENTS = {
    TITLE: '<!-- title tag -->',
    DESCRIPTION: '<!-- description tag -->',
    CUSTOM_CSS: '<!-- custom css tag -->',
    META_TAGS: '<!-- meta tags -->'
};
exports.CUSTOM_HTML_TAG_COMMENTS = CUSTOM_HTML_TAG_COMMENTS;
// ---------------------------------------------------------------------------
var FEEDS = {
    COUNT: 20
};
exports.FEEDS = FEEDS;
var MAX_LOGS_OUTPUT_CHARACTERS = 10 * 1000 * 1000;
exports.MAX_LOGS_OUTPUT_CHARACTERS = MAX_LOGS_OUTPUT_CHARACTERS;
// ---------------------------------------------------------------------------
var TRACKER_RATE_LIMITS = {
    INTERVAL: 60000 * 5,
    ANNOUNCES_PER_IP_PER_INFOHASH: 15,
    ANNOUNCES_PER_IP: 30 // maximum announces for all our torrents in the interval
};
exports.TRACKER_RATE_LIMITS = TRACKER_RATE_LIMITS;
var P2P_MEDIA_LOADER_PEER_VERSION = 2;
exports.P2P_MEDIA_LOADER_PEER_VERSION = P2P_MEDIA_LOADER_PEER_VERSION;
// ---------------------------------------------------------------------------
var PLUGIN_GLOBAL_CSS_FILE_NAME = 'plugins-global.css';
exports.PLUGIN_GLOBAL_CSS_FILE_NAME = PLUGIN_GLOBAL_CSS_FILE_NAME;
var PLUGIN_GLOBAL_CSS_PATH = path_1.join(config_1.CONFIG.STORAGE.TMP_DIR, PLUGIN_GLOBAL_CSS_FILE_NAME);
exports.PLUGIN_GLOBAL_CSS_PATH = PLUGIN_GLOBAL_CSS_PATH;
var DEFAULT_THEME_NAME = 'default';
exports.DEFAULT_THEME_NAME = DEFAULT_THEME_NAME;
var DEFAULT_USER_THEME_NAME = 'instance-default';
exports.DEFAULT_USER_THEME_NAME = DEFAULT_USER_THEME_NAME;
// ---------------------------------------------------------------------------
// Special constants for a test instance
if (core_utils_1.isTestInstance() === true) {
    exports.PRIVATE_RSA_KEY_SIZE = PRIVATE_RSA_KEY_SIZE = 1024;
    ACTOR_FOLLOW_SCORE.BASE = 20;
    REMOTE_SCHEME.HTTP = 'http';
    REMOTE_SCHEME.WS = 'ws';
    STATIC_MAX_AGE.SERVER = '0';
    ACTIVITY_PUB.COLLECTION_ITEMS_PER_PAGE = 2;
    ACTIVITY_PUB.ACTOR_REFRESH_INTERVAL = 10 * 1000; // 10 seconds
    ACTIVITY_PUB.VIDEO_REFRESH_INTERVAL = 10 * 1000; // 10 seconds
    ACTIVITY_PUB.VIDEO_PLAYLIST_REFRESH_INTERVAL = 10 * 1000; // 10 seconds
    CONSTRAINTS_FIELDS.ACTORS.AVATAR.FILE_SIZE.max = 100 * 1024; // 100KB
    SCHEDULER_INTERVALS_MS.actorFollowScores = 1000;
    SCHEDULER_INTERVALS_MS.removeOldJobs = 10000;
    SCHEDULER_INTERVALS_MS.removeOldHistory = 5000;
    SCHEDULER_INTERVALS_MS.removeOldViews = 5000;
    SCHEDULER_INTERVALS_MS.updateVideos = 5000;
    REPEAT_JOBS['videos-views'] = { every: 5000 };
    REDUNDANCY.VIDEOS.RANDOMIZED_FACTOR = 1;
    exports.VIDEO_VIEW_LIFETIME = VIDEO_VIEW_LIFETIME = 1000; // 1 second
    exports.CONTACT_FORM_LIFETIME = CONTACT_FORM_LIFETIME = 1000; // 1 second
    JOB_ATTEMPTS['email'] = 1;
    FILES_CACHE.VIDEO_CAPTIONS.MAX_AGE = 3000;
    MEMOIZE_TTL.OVERVIEWS_SAMPLE = 1;
    ROUTE_CACHE_LIFETIME.OVERVIEWS.VIDEOS = '0ms';
}
updateWebserverUrls();
updateWebserverConfig();
config_1.registerConfigChangedHandler(function () {
    updateWebserverUrls();
    updateWebserverConfig();
});
// ---------------------------------------------------------------------------
function buildVideoMimetypeExt() {
    var data = {
        'video/webm': '.webm',
        'video/ogg': '.ogv',
        'video/mp4': '.mp4'
    };
    if (config_1.CONFIG.TRANSCODING.ENABLED) {
        if (config_1.CONFIG.TRANSCODING.ALLOW_ADDITIONAL_EXTENSIONS) {
            Object.assign(data, {
                'video/quicktime': '.mov',
                'video/x-msvideo': '.avi',
                'video/x-flv': '.flv',
                'video/x-matroska': '.mkv',
                'application/octet-stream': '.mkv',
                'video/avi': '.avi'
            });
        }
        if (config_1.CONFIG.TRANSCODING.ALLOW_AUDIO_FILES) {
            Object.assign(data, MIMETYPES.AUDIO.MIMETYPE_EXT);
        }
    }
    return data;
}
function updateWebserverUrls() {
    WEBSERVER.URL = core_utils_1.sanitizeUrl(config_1.CONFIG.WEBSERVER.SCHEME + '://' + config_1.CONFIG.WEBSERVER.HOSTNAME + ':' + config_1.CONFIG.WEBSERVER.PORT);
    WEBSERVER.HOST = core_utils_1.sanitizeHost(config_1.CONFIG.WEBSERVER.HOSTNAME + ':' + config_1.CONFIG.WEBSERVER.PORT, REMOTE_SCHEME.HTTP);
    WEBSERVER.SCHEME = config_1.CONFIG.WEBSERVER.SCHEME;
    WEBSERVER.WS = config_1.CONFIG.WEBSERVER.WS;
    WEBSERVER.HOSTNAME = config_1.CONFIG.WEBSERVER.HOSTNAME;
    WEBSERVER.PORT = config_1.CONFIG.WEBSERVER.PORT;
}
function updateWebserverConfig() {
    MIMETYPES.VIDEO.MIMETYPE_EXT = buildVideoMimetypeExt();
    MIMETYPES.VIDEO.EXT_MIMETYPE = lodash_1.invert(MIMETYPES.VIDEO.MIMETYPE_EXT);
    ACTIVITY_PUB.URL_MIME_TYPES.VIDEO = Object.keys(MIMETYPES.VIDEO.MIMETYPE_EXT);
    CONSTRAINTS_FIELDS.VIDEOS.EXTNAME = buildVideosExtname();
}
function buildVideosExtname() {
    return Object.keys(MIMETYPES.VIDEO.EXT_MIMETYPE);
}
function loadLanguages() {
    Object.assign(VIDEO_LANGUAGES, buildLanguages());
}
exports.loadLanguages = loadLanguages;
function buildLanguages() {
    var iso639 = require('iso-639-3');
    var languages = {};
    var additionalLanguages = {
        'sgn': true,
        'ase': true,
        'sdl': true,
        'bfi': true,
        'bzs': true,
        'csl': true,
        'cse': true,
        'dsl': true,
        'fsl': true,
        'gsg': true,
        'pks': true,
        'jsl': true,
        'sfs': true,
        'swl': true,
        'rsl': true,
        'epo': true,
        'tlh': true,
        'jbo': true,
        'avk': true // Kotava
    };
    // Only add ISO639-1 languages and some sign languages (ISO639-3)
    iso639
        .filter(function (l) {
        return (l.iso6391 !== null && l.type === 'living') ||
            additionalLanguages[l.iso6393] === true;
    })
        .forEach(function (l) { return languages[l.iso6391 || l.iso6393] = l.name; });
    // Override Occitan label
    languages['oc'] = 'Occitan';
    languages['el'] = 'Greek';
    return languages;
}
exports.buildLanguages = buildLanguages;
