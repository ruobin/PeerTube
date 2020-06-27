"use strict";
exports.__esModule = true;
var path_1 = require("path");
// Do not use barrels, remain constants as independent as possible
var core_utils_1 = require("../helpers/core-utils");
var bytes = require("bytes");
// Use a variable to reload the configuration if we need
var config = require('config');
var configChangedHandlers = [];
var CONFIG = {
    CUSTOM_FILE: getLocalConfigFilePath(),
    LISTEN: {
        PORT: config.get('listen.port'),
        HOSTNAME: config.get('listen.hostname')
    },
    DATABASE: {
        DBNAME: 'peertube' + config.get('database.suffix'),
        HOSTNAME: config.get('database.hostname'),
        PORT: config.get('database.port'),
        USERNAME: config.get('database.username'),
        PASSWORD: config.get('database.password'),
        POOL: {
            MAX: config.get('database.pool.max')
        }
    },
    REDIS: {
        HOSTNAME: config.has('redis.hostname') ? config.get('redis.hostname') : null,
        PORT: config.has('redis.port') ? config.get('redis.port') : null,
        SOCKET: config.has('redis.socket') ? config.get('redis.socket') : null,
        AUTH: config.has('redis.auth') ? config.get('redis.auth') : null,
        DB: config.has('redis.db') ? config.get('redis.db') : null
    },
    SMTP: {
        HOSTNAME: config.get('smtp.hostname'),
        PORT: config.get('smtp.port'),
        USERNAME: config.get('smtp.username'),
        PASSWORD: config.get('smtp.password'),
        TLS: config.get('smtp.tls'),
        DISABLE_STARTTLS: config.get('smtp.disable_starttls'),
        CA_FILE: config.get('smtp.ca_file'),
        FROM_ADDRESS: config.get('smtp.from_address')
    },
    EMAIL: {
        BODY: {
            SIGNATURE: config.get('email.body.signature')
        },
        SUBJECT: {
            PREFIX: config.get('email.subject.prefix') + ' '
        }
    },
    STORAGE: {
        TMP_DIR: core_utils_1.buildPath(config.get('storage.tmp')),
        AVATARS_DIR: core_utils_1.buildPath(config.get('storage.avatars')),
        LOG_DIR: core_utils_1.buildPath(config.get('storage.logs')),
        VIDEOS_DIR: core_utils_1.buildPath(config.get('storage.videos')),
        STREAMING_PLAYLISTS_DIR: core_utils_1.buildPath(config.get('storage.streaming_playlists')),
        REDUNDANCY_DIR: core_utils_1.buildPath(config.get('storage.redundancy')),
        THUMBNAILS_DIR: core_utils_1.buildPath(config.get('storage.thumbnails')),
        PREVIEWS_DIR: core_utils_1.buildPath(config.get('storage.previews')),
        CAPTIONS_DIR: core_utils_1.buildPath(config.get('storage.captions')),
        TORRENTS_DIR: core_utils_1.buildPath(config.get('storage.torrents')),
        CACHE_DIR: core_utils_1.buildPath(config.get('storage.cache')),
        PLUGINS_DIR: core_utils_1.buildPath(config.get('storage.plugins'))
    },
    WEBSERVER: {
        SCHEME: config.get('webserver.https') === true ? 'https' : 'http',
        WS: config.get('webserver.https') === true ? 'wss' : 'ws',
        HOSTNAME: config.get('webserver.hostname'),
        PORT: config.get('webserver.port')
    },
    RATES_LIMIT: {
        API: {
            WINDOW_MS: core_utils_1.parseDurationToMs(config.get('rates_limit.api.window')),
            MAX: config.get('rates_limit.api.max')
        },
        SIGNUP: {
            WINDOW_MS: core_utils_1.parseDurationToMs(config.get('rates_limit.signup.window')),
            MAX: config.get('rates_limit.signup.max')
        },
        LOGIN: {
            WINDOW_MS: core_utils_1.parseDurationToMs(config.get('rates_limit.login.window')),
            MAX: config.get('rates_limit.login.max')
        },
        ASK_SEND_EMAIL: {
            WINDOW_MS: core_utils_1.parseDurationToMs(config.get('rates_limit.ask_send_email.window')),
            MAX: config.get('rates_limit.ask_send_email.max')
        }
    },
    TRUST_PROXY: config.get('trust_proxy'),
    LOG: {
        LEVEL: config.get('log.level'),
        ROTATION: config.get('log.rotation.enabled')
    },
    SEARCH: {
        REMOTE_URI: {
            USERS: config.get('search.remote_uri.users'),
            ANONYMOUS: config.get('search.remote_uri.anonymous')
        }
    },
    TRENDING: {
        VIDEOS: {
            INTERVAL_DAYS: config.get('trending.videos.interval_days')
        }
    },
    REDUNDANCY: {
        VIDEOS: {
            CHECK_INTERVAL: core_utils_1.parseDurationToMs(config.get('redundancy.videos.check_interval')),
            STRATEGIES: buildVideosRedundancy(config.get('redundancy.videos.strategies'))
        }
    },
    CSP: {
        ENABLED: config.get('csp.enabled'),
        REPORT_ONLY: config.get('csp.report_only'),
        REPORT_URI: config.get('csp.report_uri')
    },
    TRACKER: {
        ENABLED: config.get('tracker.enabled'),
        PRIVATE: config.get('tracker.private'),
        REJECT_TOO_MANY_ANNOUNCES: config.get('tracker.reject_too_many_announces')
    },
    HISTORY: {
        VIDEOS: {
            MAX_AGE: core_utils_1.parseDurationToMs(config.get('history.videos.max_age'))
        }
    },
    VIEWS: {
        VIDEOS: {
            REMOTE: {
                MAX_AGE: core_utils_1.parseDurationToMs(config.get('views.videos.remote.max_age'))
            }
        }
    },
    PLUGINS: {
        INDEX: {
            ENABLED: config.get('plugins.index.enabled'),
            CHECK_LATEST_VERSIONS_INTERVAL: core_utils_1.parseDurationToMs(config.get('plugins.index.check_latest_versions_interval')),
            URL: config.get('plugins.index.url')
        }
    },
    ADMIN: {
        get EMAIL() { return config.get('admin.email'); }
    },
    CONTACT_FORM: {
        get ENABLED() { return config.get('contact_form.enabled'); }
    },
    SIGNUP: {
        get ENABLED() { return config.get('signup.enabled'); },
        get LIMIT() { return config.get('signup.limit'); },
        get REQUIRES_EMAIL_VERIFICATION() { return config.get('signup.requires_email_verification'); },
        FILTERS: {
            CIDR: {
                get WHITELIST() { return config.get('signup.filters.cidr.whitelist'); },
                get BLACKLIST() { return config.get('signup.filters.cidr.blacklist'); }
            }
        }
    },
    USER: {
        get VIDEO_QUOTA() { return core_utils_1.parseBytes(config.get('user.video_quota')); },
        get VIDEO_QUOTA_DAILY() { return core_utils_1.parseBytes(config.get('user.video_quota_daily')); }
    },
    TRANSCODING: {
        get ENABLED() { return config.get('transcoding.enabled'); },
        get ALLOW_ADDITIONAL_EXTENSIONS() { return config.get('transcoding.allow_additional_extensions'); },
        get ALLOW_AUDIO_FILES() { return config.get('transcoding.allow_audio_files'); },
        get THREADS() { return config.get('transcoding.threads'); },
        RESOLUTIONS: {
            get '240p'() { return config.get('transcoding.resolutions.240p'); },
            get '360p'() { return config.get('transcoding.resolutions.360p'); },
            get '480p'() { return config.get('transcoding.resolutions.480p'); },
            get '720p'() { return config.get('transcoding.resolutions.720p'); },
            get '1080p'() { return config.get('transcoding.resolutions.1080p'); },
            get '2160p'() { return config.get('transcoding.resolutions.2160p'); }
        },
        HLS: {
            get ENABLED() { return config.get('transcoding.hls.enabled'); }
        }
    },
    IMPORT: {
        VIDEOS: {
            HTTP: {
                get ENABLED() { return config.get('import.videos.http.enabled'); }
            },
            TORRENT: {
                get ENABLED() { return config.get('import.videos.torrent.enabled'); }
            }
        }
    },
    AUTO_BLACKLIST: {
        VIDEOS: {
            OF_USERS: {
                get ENABLED() { return config.get('auto_blacklist.videos.of_users.enabled'); }
            }
        }
    },
    CACHE: {
        PREVIEWS: {
            get SIZE() { return config.get('cache.previews.size'); }
        },
        VIDEO_CAPTIONS: {
            get SIZE() { return config.get('cache.captions.size'); }
        }
    },
    INSTANCE: {
        get NAME() { return config.get('instance.name'); },
        get SHORT_DESCRIPTION() { return config.get('instance.short_description'); },
        get DESCRIPTION() { return config.get('instance.description'); },
        get TERMS() { return config.get('instance.terms'); },
        get IS_NSFW() { return config.get('instance.is_nsfw'); },
        get DEFAULT_CLIENT_ROUTE() { return config.get('instance.default_client_route'); },
        get DEFAULT_NSFW_POLICY() { return config.get('instance.default_nsfw_policy'); },
        CUSTOMIZATIONS: {
            get JAVASCRIPT() { return config.get('instance.customizations.javascript'); },
            get CSS() { return config.get('instance.customizations.css'); }
        },
        get ROBOTS() { return config.get('instance.robots'); },
        get SECURITYTXT() { return config.get('instance.securitytxt'); },
        get SECURITYTXT_CONTACT() { return config.get('admin.email'); }
    },
    SERVICES: {
        TWITTER: {
            get USERNAME() { return config.get('services.twitter.username'); },
            get WHITELISTED() { return config.get('services.twitter.whitelisted'); }
        }
    },
    FOLLOWERS: {
        INSTANCE: {
            get ENABLED() { return config.get('followers.instance.enabled'); },
            get MANUAL_APPROVAL() { return config.get('followers.instance.manual_approval'); }
        }
    },
    THEME: {
        get DEFAULT() { return config.get('theme.default'); }
    }
};
exports.CONFIG = CONFIG;
function registerConfigChangedHandler(fun) {
    configChangedHandlers.push(fun);
}
exports.registerConfigChangedHandler = registerConfigChangedHandler;
// ---------------------------------------------------------------------------
function getLocalConfigFilePath() {
    var configSources = config.util.getConfigSources();
    if (configSources.length === 0)
        throw new Error('Invalid config source.');
    var filename = 'local';
    if (process.env.NODE_ENV)
        filename += "-" + process.env.NODE_ENV;
    if (process.env.NODE_APP_INSTANCE)
        filename += "-" + process.env.NODE_APP_INSTANCE;
    return path_1.join(path_1.dirname(configSources[0].name), filename + '.json');
}
function buildVideosRedundancy(objs) {
    if (!objs)
        return [];
    if (!Array.isArray(objs))
        return objs;
    return objs.map(function (obj) {
        return Object.assign({}, obj, {
            minLifetime: core_utils_1.parseDurationToMs(obj.min_lifetime),
            size: bytes.parse(obj.size),
            minViews: obj.min_views
        });
    });
}
function reloadConfig() {
    function directory() {
        if (process.env.NODE_CONFIG_DIR) {
            return process.env.NODE_CONFIG_DIR;
        }
        return path_1.join(core_utils_1.root(), 'config');
    }
    function purge() {
        for (var fileName in require.cache) {
            if (-1 === fileName.indexOf(directory())) {
                continue;
            }
            delete require.cache[fileName];
        }
        delete require.cache[require.resolve('config')];
    }
    purge();
    config = require('config');
    for (var _i = 0, configChangedHandlers_1 = configChangedHandlers; _i < configChangedHandlers_1.length; _i++) {
        var configChangedHandler = configChangedHandlers_1[_i];
        configChangedHandler();
    }
}
exports.reloadConfig = reloadConfig;
