"use strict";
exports.__esModule = true;
var express_validator_1 = require("express-validator");
var signature_1 = require("../../../helpers/custom-validators/activitypub/signature");
var misc_1 = require("../../../helpers/custom-validators/misc");
var logger_1 = require("../../../helpers/logger");
var utils_1 = require("../utils");
var signatureValidator = [
    express_validator_1.body('signature.type')
        .optional()
        .custom(signature_1.isSignatureTypeValid).withMessage('Should have a valid signature type'),
    express_validator_1.body('signature.created')
        .optional()
        .custom(misc_1.isDateValid).withMessage('Should have a valid signature created date'),
    express_validator_1.body('signature.creator')
        .optional()
        .custom(signature_1.isSignatureCreatorValid).withMessage('Should have a valid signature creator'),
    express_validator_1.body('signature.signatureValue')
        .optional()
        .custom(signature_1.isSignatureValueValid).withMessage('Should have a valid signature value'),
    function (req, res, next) {
        logger_1.logger.debug('Checking activitypub signature parameter', { parameters: { signature: req.body.signature } });
        if (utils_1.areValidationErrors(req, res))
            return;
        return next();
    }
];
exports.signatureValidator = signatureValidator;
