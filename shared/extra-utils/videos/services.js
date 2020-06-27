"use strict";
exports.__esModule = true;
var request = require("supertest");
function getOEmbed(url, oembedUrl, format, maxHeight, maxWidth) {
    var path = '/services/oembed';
    var query = {
        url: oembedUrl,
        format: format,
        maxheight: maxHeight,
        maxwidth: maxWidth
    };
    return request(url)
        .get(path)
        .query(query)
        .set('Accept', 'application/json')
        .expect(200);
}
exports.getOEmbed = getOEmbed;
