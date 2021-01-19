"use strict";

const async = require("async");
const glob = require("glob");

const librariesPattern = /([A-Z0-9._%+-/]+)\/[A-Z0-9._]*\.library$/i;
const testPagesPattern = /(([A-Z0-9._%+-]+\/)+([A-Z_0-9-\\.]+)\.(html|htm))$/i;
const urlPattern = /\/(app_pages|all_libs|all_tests)(?:[?#].*)?$/;

function eachGlobbedFile(folders, globPatterns, eachCallback, finishedCallback) {
	if (typeof globPatterns === "string") {
		globPatterns = [globPatterns];
	}
	async.eachSeries(folders, function(folder, folderDone) {
		async.eachSeries(globPatterns, function(globPattern, globDone) {
			glob(globPattern, {cwd: folder}, function(err, files) {
				if (err) {
					globDone(err);
				}
				files.forEach(eachCallback);
				globDone();
			});
		}, folderDone);
	}, finishedCallback);
}

module.exports = function(options) {
	return function discoveryMiddleware(req, res, next) {
		const parts = urlPattern.exec(req.url);
		const type = parts && parts[1];
		if (!type) {
			next();
			return;
		}

		const response = [];

		function sendResponse() {
			const responseData = {};
			responseData[type] = response;
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify(responseData));
		}

		if (type === "app_pages") {
			eachGlobbedFile(options.appresources, "**/*.{html,htm}", function(file) {
				response.push({
					entry: file
				});
			}, sendResponse);
		} else if (type === "all_libs") {
			eachGlobbedFile(options.resources, ["**/.library", "**/*.library"], function(file) {
				const match = librariesPattern.exec(file);
				if (match) {
					response.push({
						entry: match[1]
					});
				}
			}, sendResponse);
		} else if (type === "all_tests") {
			const mLibs = {};

			async.series([
				function(done) {
					eachGlobbedFile(options.resources, ["**/.library", "**/*.library"], function(file) {
						const match = librariesPattern.exec(file);
						if (match) {
							const lib = match[1];
							mLibs[lib] = lib.replace(/\//g, ".");
						}
					}, done);
				},
				function(done) {
					eachGlobbedFile(options.testresources, "**/*.{html,htm}", function(file) {
						if (testPagesPattern.test(file)) {
							Object.keys(mLibs).forEach(function(lib) {
								if (file.indexOf(lib + "/") === 0) {
									response.push({
										lib: mLibs[lib],
										name: file.substr(lib.length + 1),
										url: "../" + file
									});
								}
							});
						}
					}, done);
				}
			], sendResponse);
		}
	};
};
