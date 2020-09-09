'use strict';

var serialize = require('cookie').serialize;
var parse = require('set-cookie-parser').parse;
function noop($) {return $};

module.exports = function(cookies) {
	return parse(cookies, {
		// Do not decode as we don't want to change the value
		decodeValues: false,
		map: false // ensure to return array
	}).map(function(cookie) {
		return serialize(cookie.name, cookie.value, {
			// Do not pass "secure", "domain", "path", "sameSite" to remove them from the cookie
			expires: cookie.expires,
			maxAge: cookie.maxAge,
			httpOnly: cookie.httpOnly,

			// As we didn't decode, we should also not encode the value
			// Encoding can't be disabled so just providing a "noop" function
			// that returns the given value
			encode: noop
		});
	});
};
