"use strict";

const url = require("url");
const path = require("path");
const extend = require("extend");
const less = require("less-openui5");


const themeFilesPattern = /^\/(.*)\/themes\/(.*)\/library(\.css|-RTL\.css|-parameters\.json)$/;

module.exports = function(options) {
	const builder = new less.Builder();

	return function lessMiddleware(req, res, next) {
		// handle only GET / HEAD requests
		if (!/^(GET|HEAD)$/i.test(req.method)) {
			next();
			return;
		}

		const pathname = url.parse(req.url).pathname;

		/*
		 groups (array index):
		 1 => library name
		 2 => theme name
		 3 => theme suffix
		*/
		const pathInfo = themeFilesPattern.exec(pathname);
		if (!pathInfo) {
			next();
			return;
		}

		const dirname = path.dirname(pathname);
		const lessInputPath = dirname + "/library.source.less";

		// Only compile rtl version if requested
		const rtl = pathInfo[3] === "-RTL.css";

		const lessOptions = extend(true, {
			lessInputPath: lessInputPath,
			library: {
				name: pathInfo[1].replace(/\//g, ".")
			},
			rtl: rtl
		}, options);

		builder.build(lessOptions).then(function(result) {
			// serve result
			switch (pathInfo[3]) {
			case ".css":
				res.setHeader("Content-Type", "text/css");
				res.write(result.css);
				break;
			case "-RTL.css":
				res.setHeader("Content-Type", "text/css");
				res.write(result.cssRtl);
				break;
			case "-parameters.json":
				res.setHeader("Content-Type", "application/json");
				res.write(JSON.stringify(result.variables, null, "\t"));
				break;
				// no default
			}
			res.end();
		}, function(err) {
			if (err) {
				next(err);
				return;
			}
		});
	};
};
