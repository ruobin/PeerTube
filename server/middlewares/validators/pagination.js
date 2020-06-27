"use strict";
exports.__esModule = true;
var express_validator_1 = require("express-validator");
var logger_1 = require("../../helpers/logger");
var utils_1 = require("./utils");
var paginationValidator = [
    express_validator_1.query('start').optional().isInt({ min: 0 }).withMessage('Should have a number start'),
    express_validator_1.query('count').optional().isInt({ min: 0 }).withMessage('Should have a number count'),
    function (req, res, next) {
        logger_1.logger.debug('Checking pagination parameters', { parameters: req.query });
        if (utils_1.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.paginationValidator = paginationValidator;
