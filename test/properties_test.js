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
