"use strict";
exports.__esModule = true;
// Thanks http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
var fs_extra_1 = require("fs-extra");
var path = require("path");
var winston = require("winston");
var config_1 = require("../initializers/config");
var lodash_1 = require("lodash");
var label = config_1.CONFIG.WEBSERVER.HOSTNAME + ':' + config_1.CONFIG.WEBSERVER.PORT;
// Create the directory if it does not exist
// FIXME: use async
fs_extra_1.mkdirpSync(config_1.CONFIG.STORAGE.LOG_DIR);
function loggerReplacer(key, value) {
    if (value instanceof Error) {
        var error_1 = {};
        Object.getOwnPropertyNames(value).forEach(function (key) { return error_1[key] = value[key]; });
        return error_1;
    }
    return value;
}
var consoleLoggerFormat = winston.format.printf(function (info) {
    var obj = lodash_1.omit(info, 'label', 'timestamp', 'level', 'message');
    var additionalInfos = JSON.stringify(obj, loggerReplacer, 2);
    if (additionalInfos === undefined || additionalInfos === '{}')
        additionalInfos = '';
    else
        additionalInfos = ' ' + additionalInfos;
    return "[" + info.label + "] " + info.timestamp + " " + info.level + ": " + info.message + additionalInfos;
});
exports.consoleLoggerFormat = consoleLoggerFormat;
var jsonLoggerFormat = winston.format.printf(function (info) {
    return JSON.stringify(info, loggerReplacer);
});
exports.jsonLoggerFormat = jsonLoggerFormat;
var timestampFormatter = winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
});
exports.timestampFormatter = timestampFormatter;
var labelFormatter = winston.format.label({
    label: label
});
exports.labelFormatter = labelFormatter;
var fileLoggerOptions = {
    filename: path.join(config_1.CONFIG.STORAGE.LOG_DIR, 'peertube.log'),
    handleExceptions: true,
    format: winston.format.combine(winston.format.timestamp(), jsonLoggerFormat)
};
if (config_1.CONFIG.LOG.ROTATION) {
    fileLoggerOptions.maxsize = 1024 * 1024 * 12;
    fileLoggerOptions.maxFiles = 20;
}
var logger = winston.createLogger({
    level: config_1.CONFIG.LOG.LEVEL,
    format: winston.format.combine(labelFormatter, winston.format.splat()),
    transports: [
        new winston.transports.File(fileLoggerOptions),
        new winston.transports.Console({
            handleExceptions: true,
            format: winston.format.combine(timestampFormatter, winston.format.colorize(), consoleLoggerFormat)
        })
    ],
    exitOnError: true
});
exports.logger = logger;
function bunyanLogFactory(level) {
    return function () {
        var meta = null;
        var args = [];
        args.concat(arguments);
        if (arguments[0] instanceof Error) {
            meta = arguments[0].toString();
            args = Array.prototype.slice.call(arguments, 1);
            args.push(meta);
        }
        else if (typeof (args[0]) !== 'string') {
            meta = arguments[0];
            args = Array.prototype.slice.call(arguments, 1);
            args.push(meta);
        }
        logger[level].apply(logger, args);
    };
}
var bunyanLogger = {
    trace: bunyanLogFactory('debug'),
    debug: bunyanLogFactory('debug'),
    info: bunyanLogFactory('info'),
    warn: bunyanLogFactory('warn'),
    error: bunyanLogFactory('error'),
    fatal: bunyanLogFactory('error')
};
exports.bunyanLogger = bunyanLogger;
