"use strict";
exports.__esModule = true;
var express_validator_1 = require("express-validator");
var logger_1 = require("../../helpers/logger");
function areValidationErrors(req, res) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        logger_1.logger.warn('Incorrect request parameters', { path: req.originalUrl, err: errors.mapped() });
        res.status(400).json({ errors: errors.mapped() });
        return true;
    }
    return false;
}
exports.areValidationErrors = areValidationErrors;
function checkSort(sortableColumns) {
    return [
        express_validator_1.query('sort').optional().isIn(sortableColumns).withMessage('Should have correct sortable column'),
        function (req, res, next) {
            logger_1.logger.debug('Checking sort parameters', { parameters: req.query });
            if (areValidationErrors(req, res))
                return;
            return next();
        }
    ];
}
exports.checkSort = checkSort;
function createSortableColumns(sortableColumns) {
    var sortableColumnDesc = sortableColumns.map(function (sortableColumn) { return '-' + sortableColumn; });
    return sortableColumns.concat(sortableColumnDesc);
}
exports.createSortableColumns = createSortableColumns;
