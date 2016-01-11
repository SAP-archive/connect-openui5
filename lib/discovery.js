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

var async = require('async');
var glob = require('glob');

var librariesPattern = /([A-Z0-9._%+-/]+)\/[A-Z0-9._]*\.library$/i;
var testPagesPattern = /(([A-Z0-9._%+-]+\/)+([A-Z_0-9-\\.]+)\.(html|htm))$/i;
var urlPattern = /\/(app_pages|all_libs|all_tests)(?:[?#].*)?$/;

function eachGlobbedFile(folders, globPatterns, eachCallback, finishedCallback) {
	if (typeof globPatterns === 'string') {
		globPatterns = [ globPatterns ];
	}
	async.eachSeries(folders, function(folder, folderDone) {
		async.eachSeries(globPatterns, function(globPattern, globDone) {
			glob(globPattern, { cwd: folder }, function(err, files) {
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

		var parts = urlPattern.exec(req.url);
		var type = parts && parts[1];
		if (!type) {
			next();
			return;
		}

		var response = [];

		function sendResponse() {
			var responseData = {};
			responseData[type] = response;
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify(responseData));
		}

		if (type === 'app_pages') {

			eachGlobbedFile(options.appresources, '**/*.{html,htm}', function(file) {
				response.push({
					entry: file
				});
			}, sendResponse);

		} else if (type === 'all_libs') {

			eachGlobbedFile(options.resources, ['**/.library', '**/*.library'], function(file) {
				var match = librariesPattern.exec(file);
				if (match) {
					response.push({
						entry: match[1]
					});
				}
			}, sendResponse);

		} else if (type === 'all_tests') {

			var mLibs = {};

			async.series([
				function(done) {
					eachGlobbedFile(options.resources, ['**/.library', '**/*.library'], function(file) {
						var match = librariesPattern.exec(file);
						if (match) {
							var lib = match[1];
							mLibs[lib] = lib.replace(/\//g, '.');
						}
					}, done);
				},
				function(done) {
					eachGlobbedFile(options.testresources, '**/*.{html,htm}', function(file) {
						if (testPagesPattern.test(file)) {
							Object.keys(mLibs).forEach(function(lib) {
								if (file.indexOf(lib) === 0) {
									response.push({
										lib: mLibs[lib],
										name: file.substr(lib.length + 1),
										url: '../' + file
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
