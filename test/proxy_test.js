/* eslint-env mocha */
"use strict";

const http = require("http");
const assert = require("assert");
const connect = require("connect");
const proxy = require("../").proxy;

describe("proxy middleware should proxy generic requests", function() {
	it("should proxy from one server to the other", function(done) {
		const sExpectedResponse = "All ok!";
		const sExpectedPath = "/foo/bar";
		const iExpectedStatusCode = 200;
		const oAppToBeProxied = connect();
		let sActualResponse = "";
		let sActualPath;
		let iActualStatusCode;

		oAppToBeProxied.use(function(oRequest, oResponse) {
			// no x-forwareded headers expected (wasn't configured in proxy)
			assert.equal(oRequest.headers["x-forwarded-for"], undefined);
			assert.equal(oRequest.headers["x-forwarded-port"], undefined);
			assert.equal(oRequest.headers["x-forwarded-proto"], undefined);
			sActualPath = oRequest.url;
			oResponse.setHeader("Set-Cookie", [
				"a=b; Secure; HttpOnly; Max-Age=5; SameSite=Strict",
				"c=d; Domain=example.com; HttpOnly; Expires=expires=Fri, 09-Oct-2020 10:00:00 GMT; Path=/foo"
			]);
			oResponse.end(sExpectedResponse);
		});

		const oServerToBeProxied = http.createServer(oAppToBeProxied);
		oServerToBeProxied.listen(8080);

		const oProxyApp = connect();
		oProxyApp.use(proxy());
		const oProxyServer = http.createServer(oProxyApp);
		oProxyServer.listen(9000);

		http.get("http://localhost:9000/http/localhost:8080" + sExpectedPath, function(oResponse) {
			oResponse.on("data", function(oData) {
				sActualResponse += oData;
			});
			iActualStatusCode = oResponse.statusCode;
			oResponse.on("end", function() {
				assert.equal(sActualPath, sExpectedPath);
				assert.equal(sActualResponse, sExpectedResponse);
				assert.equal(iActualStatusCode, iExpectedStatusCode);

				const cookies = oResponse.headers["set-cookie"];
				["secure", "domain", "path", "samesite"].forEach(function(attribute) {
					const hasAttribute = cookies.some(function(cookie) {
						return cookie.toLowerCase().includes(attribute);
					});
					assert.ok(!hasAttribute, attribute + " attribute should be removed from the cookies");
				});

				oServerToBeProxied.close();
				oProxyServer.close();
				done();
			});
		});
	});
	it("should proxy by respecting custom options", function(done) {
		const sExpectedResponse = "All ok!";
		const sExpectedPath = "/foo/bar";
		const iExpectedStatusCode = 200;
		const oAppToBeProxied = connect();
		let sActualResponse = "";
		let sActualPath;
		let iActualStatusCode;

		oAppToBeProxied.use(function(oRequest, oResponse) {
			// x-forwareded headers are expected (see xfwd option in proxy config)
			assert(
				oRequest.headers["x-forwarded-for"] === "127.0.0.1" ||
				oRequest.headers["x-forwarded-for"] === "::ffff:127.0.0.1"
			);
			assert.equal(oRequest.headers["x-forwarded-port"], "8080");
			assert.equal(oRequest.headers["x-forwarded-proto"], "http");
			sActualPath = oRequest.url;
			oResponse.end(sExpectedResponse);
		});

		const oServerToBeProxied = http.createServer(oAppToBeProxied);
		oServerToBeProxied.listen(8080);

		const oProxyApp = connect();
		oProxyApp.use(proxy({
			xfwd: true
		}));
		const oProxyServer = http.createServer(oProxyApp);
		oProxyServer.listen(9000);

		http.get("http://localhost:9000/http/localhost:8080" + sExpectedPath, function(oResponse) {
			oResponse.on("data", function(oData) {
				sActualResponse += oData;
			});
			iActualStatusCode = oResponse.statusCode;
			oResponse.on("end", function() {
				assert.equal(sActualPath, sExpectedPath);
				assert.equal(sActualResponse, sExpectedResponse);
				assert.equal(iActualStatusCode, iExpectedStatusCode);

				oServerToBeProxied.close();
				oProxyServer.close();
				done();
			});
		});
	});
});
