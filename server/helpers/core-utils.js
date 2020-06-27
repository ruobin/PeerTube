"use strict";
/*
  Different from 'utils' because we don't not import other PeerTube modules.
  Useful to avoid circular dependencies.
*/
exports.__esModule = true;
var crypto_1 = require("crypto");
var path_1 = require("path");
var pem = require("pem");
var url_1 = require("url");
var lodash_1 = require("lodash");
var child_process_1 = require("child_process");
var objectConverter = function (oldObject, keyConverter, valueConverter) {
    if (!oldObject || typeof oldObject !== 'object') {
        return valueConverter(oldObject);
    }
    if (Array.isArray(oldObject)) {
        return oldObject.map(function (e) { return objectConverter(e, keyConverter, valueConverter); });
    }
    var newObject = {};
    Object.keys(oldObject).forEach(function (oldKey) {
        var newKey = keyConverter(oldKey);
        newObject[newKey] = objectConverter(oldObject[oldKey], keyConverter, valueConverter);
    });
    return newObject;
};
exports.objectConverter = objectConverter;
var timeTable = {
    ms: 1,
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 3600000 * 24,
    week: 3600000 * 24 * 7,
    month: 3600000 * 24 * 30
};
function parseDurationToMs(duration) {
    if (typeof duration === 'number')
        return duration;
    if (typeof duration === 'string') {
        var split = duration.match(/^([\d\.,]+)\s?(\w+)$/);
        if (split.length === 3) {
            var len = parseFloat(split[1]);
            var unit = split[2].replace(/s$/i, '').toLowerCase();
            if (unit === 'm') {
                unit = 'ms';
            }
            return (len || 1) * (timeTable[unit] || 0);
        }
    }
    throw new Error("Duration " + duration + " could not be properly parsed");
}
exports.parseDurationToMs = parseDurationToMs;
function parseBytes(value) {
    if (typeof value === 'number')
        return value;
    var tgm = /^(\d+)\s*TB\s*(\d+)\s*GB\s*(\d+)\s*MB$/;
    var tg = /^(\d+)\s*TB\s*(\d+)\s*GB$/;
    var tm = /^(\d+)\s*TB\s*(\d+)\s*MB$/;
    var gm = /^(\d+)\s*GB\s*(\d+)\s*MB$/;
    var t = /^(\d+)\s*TB$/;
    var g = /^(\d+)\s*GB$/;
    var m = /^(\d+)\s*MB$/;
    var b = /^(\d+)\s*B$/;
    var match;
    if (value.match(tgm)) {
        match = value.match(tgm);
        return parseInt(match[1], 10) * 1024 * 1024 * 1024 * 1024
            + parseInt(match[2], 10) * 1024 * 1024 * 1024
            + parseInt(match[3], 10) * 1024 * 1024;
    }
    else if (value.match(tg)) {
        match = value.match(tg);
        return parseInt(match[1], 10) * 1024 * 1024 * 1024 * 1024
            + parseInt(match[2], 10) * 1024 * 1024 * 1024;
    }
    else if (value.match(tm)) {
        match = value.match(tm);
        return parseInt(match[1], 10) * 1024 * 1024 * 1024 * 1024
            + parseInt(match[2], 10) * 1024 * 1024;
    }
    else if (value.match(gm)) {
        match = value.match(gm);
        return parseInt(match[1], 10) * 1024 * 1024 * 1024
            + parseInt(match[2], 10) * 1024 * 1024;
    }
    else if (value.match(t)) {
        match = value.match(t);
        return parseInt(match[1], 10) * 1024 * 1024 * 1024 * 1024;
    }
    else if (value.match(g)) {
        match = value.match(g);
        return parseInt(match[1], 10) * 1024 * 1024 * 1024;
    }
    else if (value.match(m)) {
        match = value.match(m);
        return parseInt(match[1], 10) * 1024 * 1024;
    }
    else if (value.match(b)) {
        match = value.match(b);
        return parseInt(match[1], 10) * 1024;
    }
    else {
        return parseInt(value, 10);
    }
}
exports.parseBytes = parseBytes;
function sanitizeUrl(url) {
    var urlObject = new url_1.URL(url);
    if (urlObject.protocol === 'https:' && urlObject.port === '443') {
        urlObject.port = '';
    }
    else if (urlObject.protocol === 'http:' && urlObject.port === '80') {
        urlObject.port = '';
    }
    return urlObject.href.replace(/\/$/, '');
}
exports.sanitizeUrl = sanitizeUrl;
// Don't import remote scheme from constants because we are in core utils
function sanitizeHost(host, remoteScheme) {
    var toRemove = remoteScheme === 'https' ? 443 : 80;
    return host.replace(new RegExp(":" + toRemove + "$"), '');
}
exports.sanitizeHost = sanitizeHost;
function isTestInstance() {
    return process.env.NODE_ENV === 'test';
}
exports.isTestInstance = isTestInstance;
function isProdInstance() {
    return process.env.NODE_ENV === 'production';
}
exports.isProdInstance = isProdInstance;
function getAppNumber() {
    return process.env.NODE_APP_INSTANCE;
}
exports.getAppNumber = getAppNumber;
var rootPath;
function root() {
    if (rootPath)
        return rootPath;
    // We are in /helpers/utils.js
    rootPath = path_1.join(__dirname, '..', '..');
    if (path_1.basename(rootPath) === 'dist')
        rootPath = path_1.resolve(rootPath, '..');
    return rootPath;
}
exports.root = root;
// Thanks: https://stackoverflow.com/a/12034334
function escapeHTML(stringParam) {
    if (!stringParam)
        return '';
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(stringParam).replace(/[&<>"'`=\/]/g, function (s) { return entityMap[s]; });
}
exports.escapeHTML = escapeHTML;
function pageToStartAndCount(page, itemsPerPage) {
    var start = (page - 1) * itemsPerPage;
    return { start: start, count: itemsPerPage };
}
exports.pageToStartAndCount = pageToStartAndCount;
function buildPath(path) {
    if (path_1.isAbsolute(path))
        return path;
    return path_1.join(root(), path);
}
exports.buildPath = buildPath;
// Consistent with .length, lodash truncate function is not
function peertubeTruncate(str, maxLength) {
    var options = {
        length: maxLength
    };
    var truncatedStr = lodash_1.truncate(str, options);
    // The truncated string is okay, we can return it
    if (truncatedStr.length <= maxLength)
        return truncatedStr;
    // Lodash takes into account all UTF characters, whereas String.prototype.length does not: some characters have a length of 2
    // We always use the .length so we need to truncate more if needed
    options.length -= truncatedStr.length - maxLength;
    return lodash_1.truncate(str, options);
}
exports.peertubeTruncate = peertubeTruncate;
function sha256(str, encoding) {
    if (encoding === void 0) { encoding = 'hex'; }
    return crypto_1.createHash('sha256').update(str).digest(encoding);
}
exports.sha256 = sha256;
function sha1(str, encoding) {
    if (encoding === void 0) { encoding = 'hex'; }
    return crypto_1.createHash('sha1').update(str).digest(encoding);
}
exports.sha1 = sha1;
function execShell(command, options) {
    return new Promise(function (res, rej) {
        child_process_1.exec(command, options, function (err, stdout, stderr) {
            if (err)
                return rej({ err: err, stdout: stdout, stderr: stderr });
            return res({ stdout: stdout, stderr: stderr });
        });
    });
}
exports.execShell = execShell;
function promisify0(func) {
    return function promisified() {
        return new Promise(function (resolve, reject) {
            func.apply(null, [function (err, res) { return err ? reject(err) : resolve(res); }]);
        });
    };
}
exports.promisify0 = promisify0;
// Thanks to https://gist.github.com/kumasento/617daa7e46f13ecdd9b2
function promisify1(func) {
    return function promisified(arg) {
        return new Promise(function (resolve, reject) {
            func.apply(null, [arg, function (err, res) { return err ? reject(err) : resolve(res); }]);
        });
    };
}
exports.promisify1 = promisify1;
function promisify1WithVoid(func) {
    return function promisified(arg) {
        return new Promise(function (resolve, reject) {
            func.apply(null, [arg, function (err) { return err ? reject(err) : resolve(); }]);
        });
    };
}
function promisify2(func) {
    return function promisified(arg1, arg2) {
        return new Promise(function (resolve, reject) {
            func.apply(null, [arg1, arg2, function (err, res) { return err ? reject(err) : resolve(res); }]);
        });
    };
}
exports.promisify2 = promisify2;
function promisify2WithVoid(func) {
    return function promisified(arg1, arg2) {
        return new Promise(function (resolve, reject) {
            func.apply(null, [arg1, arg2, function (err) { return err ? reject(err) : resolve(); }]);
        });
    };
}
var pseudoRandomBytesPromise = promisify1(crypto_1.pseudoRandomBytes);
exports.pseudoRandomBytesPromise = pseudoRandomBytesPromise;
var createPrivateKey = promisify1(pem.createPrivateKey);
exports.createPrivateKey = createPrivateKey;
var getPublicKey = promisify1(pem.getPublicKey);
exports.getPublicKey = getPublicKey;
var execPromise2 = promisify2(child_process_1.exec);
exports.execPromise2 = execPromise2;
var execPromise = promisify1(child_process_1.exec);
exports.execPromise = execPromise;
