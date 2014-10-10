// Copyright 2014 SAP SE.
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
var async = require('async');

/**
 * Discovery Service
 */
module.exports = function(options) {

	var rAppPages = new RegExp('.+\\.(html|htm)$', 'i');
	var rLibraries = new RegExp('/([A-Z0-9._%+-/]+)/[A-Z0-9._]*\\.library$', 'i');
	var rTestPages = new RegExp('(/([A-Z0-9._%+-]+/)+([A-Z_0-9-\\.]+)\\.(html|qunit\\.html))$', 'i');

	var aAppResources = [];
	var aResources = [];
	var aTestResources = [];

	function findFiles(dir, rootdir, done) {
		if (typeof rootdir === 'function') {
			done = rootdir;
			rootdir = undefined;
		}
		rootdir = rootdir || dir;
		var aResults = [];
		fs.readdir(dir, function(err, files) {
			if (err) {
				done(null, []); // do not throw an error here!
				return;
			}
			var dirCount = files.length;
			if (!dirCount) {
				done(null, aResults);
				return;
			}
			files.forEach(function(file) {
				file = dir + '/' + file;
				fs.stat(file, function(err, stat) {
					if (stat) {
						if (stat.isDirectory()) {
							findFiles(file, rootdir, function(err, res) {
								aResults = aResults.concat(res);
								dirCount--;
								if (!dirCount) {
									done(null, aResults);
								}
							});
						} else {
							var path = file.substr(rootdir.length, file.length);
							aResults.push(path);
							dirCount--;
							if (!dirCount) {
								done(null, aResults);
							}
						}
					} else {
						dirCount--;
						if (!dirCount) {
							done(null, aResults);
						}
					}
				});
			});
		});
	}

	var startAppResources = process.hrtime();
	async.concat(options.appresources, findFiles, function(err, res) {
		var elapsed = process.hrtime(startAppResources)[1] / 1000000;
		console.log('AppResources found ' + res.length + ' entries / took ' + elapsed + ' ms');
		aAppResources = res;
	});

	var startResources = process.hrtime();
	async.concat(options.resources, findFiles, function(err, res) {
		var elapsed = process.hrtime(startResources)[1] / 1000000;
		console.log('Resources found ' + res.length + ' entries / took ' + elapsed + ' ms');
		aResources = res;
	});

	var startTestResources = process.hrtime();
	async.concat(options.testresources, findFiles, function(err, res) {
		var elapsed = process.hrtime(startTestResources)[1] / 1000000;
		console.log('TestResources found ' + res.length + ' entries / took ' + elapsed + ' ms');
		aTestResources = res;
	});

	return function discoveryMiddleware(req, res, next) {

		var aParts = req.url && /([^?#]*)\/discovery\/(app_pages|all_libs|all_tests)(?:[?#].*)?$/.exec(req.url);
		var sType = aParts && aParts[2];
		if (!sType) {
			next();
			return;
		}
		var mData = {}, sData = '';
		mData[sType] = [];

		var sContentType = 'application/json';
		if (sType === 'app_pages') {
			aAppResources.forEach(function(res) {
				if (rAppPages.test(res)) {
					mData[sType].push({entry: res.substr(1)});
				}
			});
		} else if (sType === 'all_libs') {
			aResources.forEach(function(res) {
				var m = rLibraries.exec(res);
				if (m) {
					mData[sType].push({entry: m[1]});
				}
			});
		console.log(mData);
		} else if (sType === 'all_tests') {
			var mLibs = {};
			aResources.forEach(function(res) {
				var m = rLibraries.exec(res);
				if (m) {
					var lib = m[1];
					mLibs[lib] = lib.replace(/\//g, '.');
				}
			});
			aTestResources.forEach(function(res) {
				if (rTestPages.test(res)) {
					Object.keys(mLibs).forEach(function(lib) {
						if (res.substr(1).indexOf(lib) === 0) {
							mData[sType].push({
								lib: mLibs[lib],
								name: res.substr(2 + lib.length),
								url: '/' + options.contextpath + '/test-resources' + res
							});
						}
					});
				}
			});
		}

		sData = sData || JSON.stringify(mData);
		res.writeHead(200, {
			'Content-Length' : sData.length,
			'Content-Type' : sContentType
		});
		res.write(sData);
		res.end();
	};

};
