"use strict";
exports.__esModule = true;
var express_validator_1 = require("express-validator");
var logger_1 = require("../../helpers/logger");
var utils_1 = require("./utils");
var misc_1 = require("../../helpers/custom-validators/misc");
var userHistoryRemoveValidator = [
    express_validator_1.body('beforeDate')
        .optional()
        .custom(misc_1.isDateValid).withMessage('Should have a valid before date'),
    function (req, res, next) {
        logger_1.logger.debug('Checking userHistoryRemoveValidator parameters', { parameters: req.body });
        if (utils_1.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.userHistoryRemoveValidator = userHistoryRemoveValidator;
