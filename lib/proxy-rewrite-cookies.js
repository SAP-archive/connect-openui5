'use strict';

var serialize = require('cookie').serialize;
var parse = require('set-cookie-parser').parse;

module.exports = function(cookies) {
	return parse(cookies, {
		decodeValues: false,
		map: false // ensure to return array
	}).map(function(cookie) {
		return serialize(cookie.name, cookie.value, {
			// Do not pass "secure", "domain", "path", "sameSite" to remove them from the cookie
			expires: cookie.expires,
			maxAge: cookie.maxAge,
			httpOnly: cookie.httpOnly
		});
	});
};
