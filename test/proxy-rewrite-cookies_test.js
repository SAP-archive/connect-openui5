/* eslint-env mocha */
"use strict";

const assert = require("assert");
const rewriteCookies = require("../lib/proxy-rewrite-cookies");

describe("proxy-rewrite-cookies", function() {
	it("should return empty array when no value is provided", function() {
		assert.deepEqual(rewriteCookies(), []);
	});
	it("should return empty array when empty string is provided", function() {
		assert.deepEqual(rewriteCookies(""), []);
	});
	it("should return empty array when empty array is provided", function() {
		assert.deepEqual(rewriteCookies([]), []);
	});
	it("should return cookie with only key / value", function() {
		assert.deepEqual(rewriteCookies("foo=bar"), ["foo=bar"]);
	});
	it("should return multiple cookies with only key / value", function() {
		assert.deepEqual(rewriteCookies(["foo=1", "bar=2"]), ["foo=1", "bar=2"]);
	});
	it("should remove secure attribute", function() {
		assert.deepEqual(rewriteCookies(["foo=bar; Secure;"]), ["foo=bar"]);
	});
	it("should remove domain attribute", function() {
		assert.deepEqual(rewriteCookies(["foo=bar; Domain=example.com;"]), ["foo=bar"]);
	});
	it("should remove path attribute", function() {
		assert.deepEqual(rewriteCookies(["foo=bar; Path=/foo;"]), ["foo=bar"]);
	});
	it("should remove samesite attribute", function() {
		assert.deepEqual(rewriteCookies(["foo=bar; SameSite=Lax;"]), ["foo=bar"]);
	});
	it("should NOT remove Expires attribute", function() {
		assert.deepEqual(rewriteCookies(
			["foo=bar; Expires=Fri, 09-Oct-2020 10:00:00 GMT;"]),
		["foo=bar; Expires=Fri, 09 Oct 2020 10:00:00 GMT"]);
	});
	it("should NOT remove Max-Age attribute", function() {
		assert.deepEqual(rewriteCookies(
			["foo=bar; Max-Age=123;"]),
		["foo=bar; Max-Age=123"]);
	});
	it("should NOT remove HttpOnly attribute", function() {
		assert.deepEqual(rewriteCookies(
			["foo=bar; HttpOnly;"]),
		["foo=bar; HttpOnly"]);
	});
	it("should handle all attributes at once", function() {
		assert.deepEqual(rewriteCookies(
			["foo=bar; Secure; Domain=example.com; Expires=Fri, 09-Oct-2020 10:00:00 GMT; " +
			"Path=/foo; Max-Age=123; SameSite=Lax; HttpOnly;"]),
		["foo=bar; Max-Age=123; Expires=Fri, 09 Oct 2020 10:00:00 GMT; HttpOnly"]);
	});
	it("should not change the value (no decoding / encoding)", function() {
		assert.deepEqual(rewriteCookies(
			["foo=bar=1"]),
		["foo=bar=1"]);
		assert.deepEqual(rewriteCookies(
			["equation=E%3Dmc%5E2"]),
		["equation=E%3Dmc%5E2"]);
	});
});
