// Copyright 2016 SAP SE.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.

'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');
var async = require('async');
var extend = require('extend');
var less = require('less-openui5');


var themeFilesPattern = /^\/(.*)\/themes\/(.*)\/library(\.css|-RTL\.css|-parameters\.json)$/;

module.exports = function(options) {

	var themeCacheMapping = {};

	function findInPaths(filePath, cb) {
		// try to find file in all libraries
		async.concat(options.rootPaths.map(function(dirPath) {
			return path.join(dirPath, filePath);
		}), function(fullPath, mapCb) {
			fs.stat(fullPath, function(err, stat) {
				// no error handling here as it is ok if the file was not found in one lib
				var result = stat ? { path: fullPath, stat: stat } : null;
				mapCb(null, result); // do not pass in the error as the first argument to prevent async.concat from failing
			});
		}, cb);
	}

	function compileLess(themeDir, lessInfo, pathInfo, res, next) {
		fs.readFile(lessInfo.path, {
			encoding: 'utf8'
		}, function(fileErr, str) {

			if (fileErr) {
				next(fileErr);
				return;
			}

			var lessOptions = extend(true, {
				parser: {
					filename: lessInfo.path
				},
				library: {
					name: pathInfo[1].replace(/\//g, '\.')
				}
			}, options);

			less.build(str, lessOptions, function(buildErr, result) {
				if (buildErr) {
					next(buildErr);
					return;
				}

				async.map(result.imports, fs.stat, function(statErr, importStats) {
					if (statErr) {
						next(statErr);
						return;
					}

					// save theme in memory cache
					themeCacheMapping[themeDir] = {
						less: {
							stat: lessInfo.stat,
							path: lessInfo.path
						},
						imports: {
							stats: importStats,
							paths: result.imports
						},
						css: result.css,
						cssRtl: result.cssRtl,
						variables: result.variables
					};

					serveFromCache(themeDir, pathInfo, res, next);

				});

			});
		});
	}

	function serveFromCache(themeDir, pathInfo, res, next) {
		var theme = themeCacheMapping[themeDir];
		switch (pathInfo[3]) {
			case '.css':
				res.setHeader('Content-Type', 'text/css');
				res.write(theme.css);
				break;
			case '-RTL.css':
				res.setHeader('Content-Type', 'text/css');
				res.write(theme.cssRtl);
				break;
			case '-parameters.json':
				res.setHeader('Content-Type', 'application/json');
				res.write(JSON.stringify(theme.variables, null, '\t'));
				break;
			// no default
		}
		res.end();
	}

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
		var match = themeFilesPattern.exec(pathname);
		if (!match) {
			next();
			return;
		}

		var dirname = path.dirname(pathname);

		// find corresponding library.source.less file
		findInPaths(dirname + '/library.source.less', function(findErr, results) {

			if (findErr) {
				next(findErr);
				return;
			}

			if (!results || results.length === 0) {
				next();
				return;
			}

			var lessInfo = results[0];

			// check theme has already been cached
			var themeCache = themeCacheMapping[dirname];
			if (themeCache) {

				// check if less file has not been changed since last less compilation
				if (themeCache.less.stat.mtime.getTime() === lessInfo.stat.mtime.getTime()) {

					// check if imported files have changed since last less compilation
					async.map(themeCache.imports.paths, function(filePath, cb) {
						fs.stat(filePath, function(statErr, stat) {
							if (statErr) {
								console.log('Failed to get stat of file: ' + filePath);
							}
							// do not hand over errors. stat will be undefined and modified check will take care
							cb(null, stat);
						});
					}, function(pathsErr, newImportStats) {
						if (pathsErr) {
							next(pathsErr);
							return;
						}

						for (var i = 0; i < newImportStats.length; i++) {
							// if a file was not found or has been changed -> re-compile
							if (!newImportStats[i] || (newImportStats[i].mtime.getTime() !== themeCache.imports.stats[i].mtime.getTime())) {
								compileLess(dirname, lessInfo, match, res, next);
								return;
							}
						}

						// use cached content if no file was changed
						serveFromCache(dirname, match, res, next);

					});

				} else {
					compileLess(dirname, lessInfo, match, res, next);
				}

			} else {
				compileLess(dirname, lessInfo, match, res, next);
			}

		});

	};

};
