"use strict";
exports.__esModule = true;
var requests_1 = require("../requests/requests");
function getConfig(url) {
    var path = '/api/v1/config';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getConfig = getConfig;
function getAbout(url) {
    var path = '/api/v1/config/about';
    return requests_1.makeGetRequest({
        url: url,
        path: path,
        statusCodeExpected: 200
    });
}
exports.getAbout = getAbout;
function getCustomConfig(url, token, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/config/custom';
    return requests_1.makeGetRequest({
        url: url,
        token: token,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.getCustomConfig = getCustomConfig;
function updateCustomConfig(url, token, newCustomConfig, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/config/custom';
    return requests_1.makePutBodyRequest({
        url: url,
        token: token,
        path: path,
        fields: newCustomConfig,
        statusCodeExpected: statusCodeExpected
    });
}
exports.updateCustomConfig = updateCustomConfig;
function updateCustomSubConfig(url, token, newConfig) {
    var updateParams = {
        instance: {
            name: 'PeerTube updated',
            shortDescription: 'my short description',
            description: 'my super description',
            terms: 'my super terms',
            defaultClientRoute: '/videos/recently-added',
            isNSFW: true,
            defaultNSFWPolicy: 'blur',
            customizations: {
                javascript: 'alert("coucou")',
                css: 'body { background-color: red; }'
            }
        },
        theme: {
            "default": 'default'
        },
        services: {
            twitter: {
                username: '@MySuperUsername',
                whitelisted: true
            }
        },
        cache: {
            previews: {
                size: 2
            },
            captions: {
                size: 3
            }
        },
        signup: {
            enabled: false,
            limit: 5,
            requiresEmailVerification: false
        },
        admin: {
            email: 'superadmin1@example.com'
        },
        contactForm: {
            enabled: true
        },
        user: {
            videoQuota: 5242881,
            videoQuotaDaily: 318742
        },
        transcoding: {
            enabled: true,
            allowAdditionalExtensions: true,
            allowAudioFiles: true,
            threads: 1,
            resolutions: {
                '240p': false,
                '360p': true,
                '480p': true,
                '720p': false,
                '1080p': false,
                '2160p': false
            },
            hls: {
                enabled: false
            }
        },
        "import": {
            videos: {
                http: {
                    enabled: false
                },
                torrent: {
                    enabled: false
                }
            }
        },
        autoBlacklist: {
            videos: {
                ofUsers: {
                    enabled: false
                }
            }
        },
        followers: {
            instance: {
                enabled: true,
                manualApproval: false
            }
        }
    };
    Object.assign(updateParams, newConfig);
    return updateCustomConfig(url, token, updateParams);
}
exports.updateCustomSubConfig = updateCustomSubConfig;
function deleteCustomConfig(url, token, statusCodeExpected) {
    if (statusCodeExpected === void 0) { statusCodeExpected = 200; }
    var path = '/api/v1/config/custom';
    return requests_1.makeDeleteRequest({
        url: url,
        token: token,
        path: path,
        statusCodeExpected: statusCodeExpected
    });
}
exports.deleteCustomConfig = deleteCustomConfig;
