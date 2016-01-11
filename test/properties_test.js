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

/*eslint-env mocha */
'use strict';

var http = require('http');
var assert = require('assert');
var connect = require('connect');
var serveStatic = require('serve-static');
var properties = require('../').properties;

describe('properties middleware', function () {

	it('should return "test.properties" with correct Content-Type header', function(done) {
		var app = connect();

		app.use(properties());
		app.use('/', serveStatic('test/fixtures/properties'));

		var server = http.createServer(app).listen(8080);

		http.get('http://localhost:8080/test.properties', function(res) {
			assert.equal(res.headers['content-type'], 'text/plain; charset=ISO-8859-1');

			var responseData = '';

			res.on('data', function(data) {
				responseData += data;
			});

			res.on('end', function() {
				assert.equal(responseData.replace(/(\n)$/, ''), 'FOO=B\\u00C4R');
				server.close();
				done();
			});

		});
	});

});
