/* eslint-env mocha */
"use strict";

const proxy = require("../").proxy;
const assert = require("assert");

function test(sRemoteLocation, pUrl, expected) {
	const uri = proxy._createUri(pUrl, sRemoteLocation);
	const url = proxy._buildRequestUrl(uri);
	assert.equal(url, expected);
}

describe("test create URL", function() {
	it("no path && no path", function() {
		test("http://localhost:1234", "", "/");
	});

	it("no path / && no path", function() {
		test("http://localhost:1234", "/", "/");
	});


	it("path && no path", function() {
		test("http://localhost:1234", "/foo/bar", "/foo/bar");
	});

	it("path && path", function() {
		test("http://localhost:1234/rfoo/rbar", "/foo/bar", "/rfoo/rbar/foo/bar");
	});


	it("path && query", function() {
		test("http://localhost:1234?rtest=1234", "/foo/bar", "/foo/bar?rtest=1234");
	});

	it("path && / query", function() {
		test("http://localhost:1234/?rtest=1234", "/foo/bar", "/foo/bar?rtest=1234");
	});

	it("path && path query", function() {
		test("http://localhost:1234/rfoo/rbar?rtest=1234", "/foo/bar", "/rfoo/rbar/foo/bar?rtest=1234");
	});

	it("path && path / query", function() {
		test("http://localhost:1234/rfoo/rbar/?rtest=1234", "/foo/bar", "/rfoo/rbar/foo/bar?rtest=1234");
	});


	it("query && path", function() {
		test("http://localhost:1234/rfoo/rbar", "?test=1234", "/rfoo/rbar?test=1234");
	});

	it("query path && query", function() {
		test("http://localhost:1234?rtest=1234", "/foo/bar?test=1234", "/foo/bar?rtest=1234&test=1234");
	});

	it("query path && / query", function() {
		test("http://localhost:1234/?rtest=1234", "/foo/bar?test=1234", "/foo/bar?rtest=1234&test=1234");
	});


	it("query path && path query", function() {
		test("http://localhost:1234/rfoo/rbar?rtest=1234", "/foo/bar?test=1234", "/rfoo/rbar/foo/bar?rtest=1234&test=1234");
	});

	it("query path && path / query", function() {
		test("http://localhost:1234/rfoo/rbar/?rtest=1234", "/foo/bar?test=1234", "/rfoo/rbar/foo/bar?rtest=1234&test=1234");
	});

	it("query path && path / query", function() {
		test("http://localhost:1234/rfoo/rbar/?rtest1=1234&rtest2=4567", "/foo/bar?test1=1234&test2=4567", "/rfoo/rbar/foo/bar?rtest1=1234&rtest2=4567&test1=1234&test2=4567");
	});
});
