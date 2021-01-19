"use strict";

const url = require("url");

module.exports = function() {
	const rProperties = /\.properties$/;
	return function propertiesMiddleware(req, res, next) {
		// ensure that *.properties files will be served as text/plain; charset=ISO-8859-1
		const sUrl = url.parse(req.url).pathname;
		if (rProperties.test(sUrl)) {
			res.setHeader("Content-Type", "text/plain; charset=ISO-8859-1");
		}
		next();
	};
};
