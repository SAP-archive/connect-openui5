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

var url = require('url');

module.exports = function() {

	var rProperties = new RegExp('\.properties$');
	return function propertiesMiddleware(req, res, next) {
			// ensure that *.properties files will be served as text/plain; charset=ISO-8859-1
			var sUrl = url.parse(req.url).pathname;
			if (rProperties.test(sUrl)) {
				res.setHeader('Content-Type', 'text/plain; charset=ISO-8859-1');
			}
			next();
	};

};
