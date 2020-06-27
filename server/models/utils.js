"use strict";
exports.__esModule = true;
var sequelize_typescript_1 = require("sequelize-typescript");
var validator = require("validator");
var sequelize_1 = require("sequelize");
// Translate for example "-name" to [ [ 'name', 'DESC' ], [ 'id', 'ASC' ] ]
function getSort(value, lastSort) {
    if (lastSort === void 0) { lastSort = ['id', 'ASC']; }
    var _a = buildDirectionAndField(value), direction = _a.direction, field = _a.field;
    var finalField;
    if (field.toLowerCase() === 'match') { // Search
        finalField = sequelize_typescript_1.Sequelize.col('similarity');
    }
    else if (field === 'videoQuotaUsed') { // Users list
        finalField = sequelize_typescript_1.Sequelize.col('videoQuotaUsed');
    }
    else {
        finalField = field;
    }
    return [[finalField, direction], lastSort];
}
exports.getSort = getSort;
function getVideoSort(value, lastSort) {
    if (lastSort === void 0) { lastSort = ['id', 'ASC']; }
    var _a = buildDirectionAndField(value), direction = _a.direction, field = _a.field;
    if (field.toLowerCase() === 'trending') { // Sort by aggregation
        return [
            [sequelize_typescript_1.Sequelize.fn('COALESCE', sequelize_typescript_1.Sequelize.fn('SUM', sequelize_typescript_1.Sequelize.col('VideoViews.views')), '0'), direction],
            [sequelize_typescript_1.Sequelize.col('VideoModel.views'), direction],
            lastSort
        ];
    }
    var finalField;
    // Alias
    if (field.toLowerCase() === 'match') { // Search
        finalField = sequelize_typescript_1.Sequelize.col('similarity');
    }
    else {
        finalField = field;
    }
    var firstSort = typeof finalField === 'string'
        ? finalField.split('.').concat([direction]) // FIXME: sequelize typings
        : [finalField, direction];
    return [firstSort, lastSort];
}
exports.getVideoSort = getVideoSort;
function getBlacklistSort(model, value, lastSort) {
    if (lastSort === void 0) { lastSort = ['id', 'ASC']; }
    var firstSort = getSort(value)[0];
    if (model)
        return [[sequelize_1.literal("\"" + model + "." + firstSort[0] + "\" " + firstSort[1])], lastSort]; // FIXME: typings
    return [firstSort, lastSort];
}
exports.getBlacklistSort = getBlacklistSort;
function isOutdated(model, refreshInterval) {
    var now = Date.now();
    var createdAtTime = model.createdAt.getTime();
    var updatedAtTime = model.updatedAt.getTime();
    return (now - createdAtTime) > refreshInterval && (now - updatedAtTime) > refreshInterval;
}
exports.isOutdated = isOutdated;
function throwIfNotValid(value, validator, fieldName, nullable) {
    if (fieldName === void 0) { fieldName = 'value'; }
    if (nullable === void 0) { nullable = false; }
    if (nullable && (value === null || value === undefined))
        return;
    if (validator(value) === false) {
        throw new Error("\"" + value + "\" is not a valid " + fieldName + ".");
    }
}
exports.throwIfNotValid = throwIfNotValid;
function buildTrigramSearchIndex(indexName, attribute) {
    return {
        name: indexName,
        fields: [sequelize_typescript_1.Sequelize.literal('lower(immutable_unaccent(' + attribute + '))')],
        using: 'gin',
        operator: 'gin_trgm_ops'
    };
}
exports.buildTrigramSearchIndex = buildTrigramSearchIndex;
function createSimilarityAttribute(col, value) {
    return sequelize_typescript_1.Sequelize.fn('similarity', searchTrigramNormalizeCol(col), searchTrigramNormalizeValue(value));
}
exports.createSimilarityAttribute = createSimilarityAttribute;
function buildBlockedAccountSQL(serverAccountId, userAccountId) {
    var blockerIds = [serverAccountId];
    if (userAccountId)
        blockerIds.push(userAccountId);
    var blockerIdsString = blockerIds.join(', ');
    return 'SELECT "targetAccountId" AS "id" FROM "accountBlocklist" WHERE "accountId" IN (' + blockerIdsString + ')' +
        ' UNION ALL ' +
        'SELECT "account"."id" AS "id" FROM account INNER JOIN "actor" ON account."actorId" = actor.id ' +
        'INNER JOIN "serverBlocklist" ON "actor"."serverId" = "serverBlocklist"."targetServerId" ' +
        'WHERE "serverBlocklist"."accountId" IN (' + blockerIdsString + ')';
}
exports.buildBlockedAccountSQL = buildBlockedAccountSQL;
function buildServerIdsFollowedBy(actorId) {
    var actorIdNumber = parseInt(actorId + '', 10);
    return '(' +
        'SELECT "actor"."serverId" FROM "actorFollow" ' +
        'INNER JOIN "actor" ON actor.id = "actorFollow"."targetActorId" ' +
        'WHERE "actorFollow"."actorId" = ' + actorIdNumber +
        ')';
}
exports.buildServerIdsFollowedBy = buildServerIdsFollowedBy;
function buildWhereIdOrUUID(id) {
    return validator.isInt('' + id) ? { id: id } : { uuid: id };
}
exports.buildWhereIdOrUUID = buildWhereIdOrUUID;
function parseAggregateResult(result) {
    if (!result)
        return 0;
    var total = parseInt(result + '', 10);
    if (isNaN(total))
        return 0;
    return total;
}
exports.parseAggregateResult = parseAggregateResult;
var createSafeIn = function (model, stringArr) {
    return stringArr.map(function (t) { return model.sequelize.escape('' + t); })
        .join(', ');
};
exports.createSafeIn = createSafeIn;
function buildLocalAccountIdsIn() {
    return sequelize_1.literal('(SELECT "account"."id" FROM "account" INNER JOIN "actor" ON "actor"."id" = "account"."actorId" AND "actor"."serverId" IS NULL)');
}
exports.buildLocalAccountIdsIn = buildLocalAccountIdsIn;
function buildLocalActorIdsIn() {
    return sequelize_1.literal('(SELECT "actor"."id" FROM "actor" WHERE "actor"."serverId" IS NULL)');
}
exports.buildLocalActorIdsIn = buildLocalActorIdsIn;
// ---------------------------------------------------------------------------
function searchTrigramNormalizeValue(value) {
    return sequelize_typescript_1.Sequelize.fn('lower', sequelize_typescript_1.Sequelize.fn('immutable_unaccent', value));
}
function searchTrigramNormalizeCol(col) {
    return sequelize_typescript_1.Sequelize.fn('lower', sequelize_typescript_1.Sequelize.fn('immutable_unaccent', sequelize_typescript_1.Sequelize.col(col)));
}
function buildDirectionAndField(value) {
    var field;
    var direction;
    if (value.substring(0, 1) === '-') {
        direction = 'DESC';
        field = value.substring(1);
    }
    else {
        direction = 'ASC';
        field = value;
    }
    return { direction: direction, field: field };
}
