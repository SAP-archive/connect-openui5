'use strict';

var url = require('url');
var path = require('path');
var extend = require('extend');
var less = require('less-openui5');


var themeFilesPattern = /^\/(.*)\/themes\/(.*)\/library(\.css|-RTL\.css|-parameters\.json)$/;

module.exports = function(options) {

	var builder = new less.Builder();

	return function lessMiddleware(req, res, next) {

		// handle only GET / HEAD requests
		if (!/^(GET|HEAD)$/i.test(req.method)) {
			next();
			return;
		}

		var pathname = url.parse(req.url).pathname;

		/*
		 groups (array index):
		 1 => library name
		 2 => theme name
		 3 => theme suffix
		*/
		var pathInfo = themeFilesPattern.exec(pathname);
		if (!pathInfo) {
			next();
			return;
		}

		var dirname = path.dirname(pathname);
		var lessInputPath = dirname + '/library.source.less';

		// Only compile rtl version if requested
		var rtl = pathInfo[3] === '-RTL.css';

		var lessOptions = extend(true, {
			lessInputPath: lessInputPath,
			library: {
				name: pathInfo[1].replace(/\//g, '\.')
			},
			rtl: rtl
		}, options);

		builder.build(lessOptions).then(function(result) {

			// serve result
			switch (pathInfo[3]) {
				case '.css':
					res.setHeader('Content-Type', 'text/css');
					res.write(result.css);
					break;
				case '-RTL.css':
					res.setHeader('Content-Type', 'text/css');
					res.write(result.cssRtl);
					break;
				case '-parameters.json':
					res.setHeader('Content-Type', 'application/json');
					res.write(JSON.stringify(result.variables, null, '\t'));
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
