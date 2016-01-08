// Copyright 2015 SAP SE.
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

var proxy = require('../').proxy;
var assert = require('assert');

function test(remote_location, pUrl, expected) {
	var uri = proxy._createUri(pUrl, remote_location);
	var url = proxy._buildRequestUrl(uri);
	assert.equal(url, expected);
}

describe('test create URL', function () {

	it('no path && no path', function () {
		test('http://localhost:1234', '', '/');
	});

	it('no path / && no path', function () {
		test('http://localhost:1234', '/', '/');
	});


	it('path && no path', function () {
		test('http://localhost:1234', '/foo/bar', '/foo/bar');
	});

	it('path && path', function () {
		test('http://localhost:1234/rfoo/rbar', '/foo/bar', '/rfoo/rbar/foo/bar');
	});


	it('path && query', function () {
		test('http://localhost:1234?rtest=1234', '/foo/bar', '/foo/bar?rtest=1234');
	});

	it('path && / query', function () {
		test('http://localhost:1234/?rtest=1234', '/foo/bar', '/foo/bar?rtest=1234');
	});

	it('path && path query', function () {
		test('http://localhost:1234/rfoo/rbar?rtest=1234', '/foo/bar', '/rfoo/rbar/foo/bar?rtest=1234');
	});

	it('path && path / query', function () {
		test('http://localhost:1234/rfoo/rbar/?rtest=1234', '/foo/bar', '/rfoo/rbar/foo/bar?rtest=1234');
	});


	it('query && path', function () {
		test('http://localhost:1234/rfoo/rbar', '?test=1234', '/rfoo/rbar?test=1234');
	});

	it('query path && query', function () {
		test('http://localhost:1234?rtest=1234', '/foo/bar?test=1234', '/foo/bar?rtest=1234&test=1234');
	});

	it('query path && / query', function () {
		test('http://localhost:1234/?rtest=1234', '/foo/bar?test=1234', '/foo/bar?rtest=1234&test=1234');
	});


	it('query path && path query', function () {
		test('http://localhost:1234/rfoo/rbar?rtest=1234', '/foo/bar?test=1234', '/rfoo/rbar/foo/bar?rtest=1234&test=1234');
	});

	it('query path && path / query', function () {
		test('http://localhost:1234/rfoo/rbar/?rtest=1234', '/foo/bar?test=1234', '/rfoo/rbar/foo/bar?rtest=1234&test=1234');
	});

	it('query path && path / query', function () {
		test('http://localhost:1234/rfoo/rbar/?rtest1=1234&rtest2=4567', '/foo/bar?test1=1234&test2=4567', '/rfoo/rbar/foo/bar?rtest1=1234&rtest2=4567&test1=1234&test2=4567');
	});

});
