"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var logger_1 = require("../../helpers/logger");
var express_validator_1 = require("express-validator");
var misc_1 = require("../../helpers/custom-validators/misc");
var videosSearchValidator = [
    express_validator_1.query('search').optional().not().isEmpty().withMessage('Should have a valid search'),
    express_validator_1.query('startDate').optional().custom(misc_1.isDateValid).withMessage('Should have a valid start date'),
    express_validator_1.query('endDate').optional().custom(misc_1.isDateValid).withMessage('Should have a valid end date'),
    express_validator_1.query('originallyPublishedStartDate').optional().custom(misc_1.isDateValid).withMessage('Should have a valid published start date'),
    express_validator_1.query('originallyPublishedEndDate').optional().custom(misc_1.isDateValid).withMessage('Should have a valid published end date'),
    express_validator_1.query('durationMin').optional().isInt().withMessage('Should have a valid min duration'),
    express_validator_1.query('durationMax').optional().isInt().withMessage('Should have a valid max duration'),
    function (req, res, next) {
        logger_1.logger.debug('Checking videos search query', { parameters: req.query });
        if (utils_1.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.videosSearchValidator = videosSearchValidator;
var videoChannelsSearchValidator = [
    express_validator_1.query('search').not().isEmpty().withMessage('Should have a valid search'),
    function (req, res, next) {
        logger_1.logger.debug('Checking video channels search query', { parameters: req.query });
        if (utils_1.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.videoChannelsSearchValidator = videoChannelsSearchValidator;
