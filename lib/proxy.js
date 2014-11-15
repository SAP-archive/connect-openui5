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

var httpProxy = require('http-proxy');
var Promise = require('es6-promise').Promise;
var npmconf = require('npmconf');

module.exports = function() {

	var urlPattern = /^\/(http|https)\/([^/]+)\/?(.*)/;
	var proxy = httpProxy.createProxyServer({});

	var loadConf = new Promise(function(resolve, reject) {
		npmconf.load(function(err, conf) {
			if (err) {
				reject(err);
			} else {
				resolve(conf);
			}
		});
	});

	return function(req, res, next) {

		var parts = urlPattern.exec(req.url);
		if (!parts) {
			return next();
		}

		var protocol = parts[1];
		var host = parts[2];
		var urlPath = '/' + parts[3] || '';

		req.url = urlPath;
		req.headers.host = host;

		loadConf.then(function(conf) {

			var proxyForRequest;
			if (protocol === 'https') {
				proxyForRequest = conf.get('https-proxy');
			}
			proxyForRequest = proxyForRequest || conf.get('http-proxy') || conf.get('proxy');

			proxy.proxyRequest(req, res, {
				target: proxyForRequest ? proxyForRequest : protocol + '://' + host
			}, function(err) {
				if (err) {
					next(err);
				}
			});

		});

	};

};
