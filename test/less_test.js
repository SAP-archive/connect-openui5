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
var less = require('../').less;

describe('less middleware', function () {

	it('should return "library.css" with correct content', function(done) {
		var app = connect();

		app.use(less({
			rootPaths: [ 'test/fixtures/less' ]
		}));

		var server = http.createServer(app).listen(8080);

		http.get('http://localhost:8080/mytheme/library.css', function(res) {
			assert.equal(res.headers['content-type'], 'text/css');

			var responseData = '';

			res.on('data', function(data) {
				responseData += data;
			});

			res.on('end', function() {
				assert.equal(responseData, '.myRule {\n  color: #000000;\n  float: left;\n}\n');
				server.close();
				done();
			});

		});
	});

	it('should return "library-RTL.css" with correct content', function(done) {
		var app = connect();

		app.use(less({
			rootPaths: [ 'test/fixtures/less' ]
		}));

		var server = http.createServer(app).listen(8080);

		http.get('http://localhost:8080/mytheme/library-RTL.css', function(res) {
			assert.equal(res.headers['content-type'], 'text/css');

			var responseData = '';

			res.on('data', function(data) {
				responseData += data;
			});

			res.on('end', function() {
				assert.equal(responseData, '.myRule {\n  color: #000000;\n  float: right;\n}\n');
				server.close();
				done();
			});

		});
	});

	it('should return "library-parameters.json" with correct content', function(done) {
		var app = connect();

		app.use(less({
			rootPaths: [ 'test/fixtures/less' ]
		}));

		var server = http.createServer(app).listen(8080);

		http.get('http://localhost:8080/mytheme/library-parameters.json', function(res) {
			assert.equal(res.headers['content-type'], 'application/json');

			var responseData = '';

			res.on('data', function(data) {
				responseData += data;
			});

			res.on('end', function() {
				assert.equal(responseData, JSON.stringify({
					myVar: '#000000'
				}, null, '\t'));
				server.close();
				done();
			});

		});
	});

});
