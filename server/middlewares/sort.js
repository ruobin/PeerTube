"use strict";
exports.__esModule = true;
function setDefaultSort(req, res, next) {
    if (!req.query.sort)
        req.query.sort = '-createdAt';
    return next();
}
exports.setDefaultSort = setDefaultSort;
function setDefaultSearchSort(req, res, next) {
    if (!req.query.sort)
        req.query.sort = '-match';
    return next();
}
exports.setDefaultSearchSort = setDefaultSearchSort;
function setBlacklistSort(req, res, next) {
    var newSort = { sortModel: undefined, sortValue: '' };
    if (!req.query.sort)
        req.query.sort = '-createdAt';
    // Set model we want to sort onto
    if (req.query.sort === '-createdAt' || req.query.sort === 'createdAt' ||
        req.query.sort === '-id' || req.query.sort === 'id') {
        // If we want to sort onto the BlacklistedVideos relation, we won't specify it in the query parameter ...
        newSort.sortModel = undefined;
    }
    else {
        newSort.sortModel = 'Video';
    }
    newSort.sortValue = req.query.sort;
    req.query.sort = newSort;
    return next();
}
exports.setBlacklistSort = setBlacklistSort;
