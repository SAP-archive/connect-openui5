/* eslint-env mocha */
"use strict";

const http = require("http");
const assert = require("assert");
const connect = require("connect");

// avoid spawning a new process
delete require.cache[require.resolve("../lib/proxy")];
process.env.REMOTE_LOCATION = "http://localhost:8080";
const proxy = require("../lib/proxy");
delete require.cache[require.resolve("../lib/proxy")];

describe("USE remote location", function() {
	it("should proxy from one server to the server and USE remote location", function(fnDone) {
		// check environment
		assert.equal(proxy._env.remoteLocation, "http://localhost:8080");

		const sExpectedResponse = "All ok!";
		const sExpectedPath = "/foo/bar?pA=1&pB=2";
		const iExpectedStatusCode = 200;
		const oAppToBeProxied = connect();
		let sActualResponse = "";
		let sActualPath;
		let iActualStatusCode;

		oAppToBeProxied.use(function(oRequest, oResponse) {
			// no x-forwarded headers expected (wasn't configured in proxy)
			assert.equal(oRequest.headers["x-forwarded-for"], undefined);
			assert.equal(oRequest.headers["x-forwarded-port"], undefined);
			assert.equal(oRequest.headers["x-forwarded-proto"], undefined);
			sActualPath = oRequest.url;
			oResponse.end(sExpectedResponse);
		});

		const oServerToBeProxied = http.createServer(oAppToBeProxied);
		oServerToBeProxied.listen(8080);

		const oProxyApp = connect();
		oProxyApp.use(proxy());
		const oProxyServer = http.createServer(oProxyApp);
		oProxyServer.listen(9000);
		oServerToBeProxied.on("close", function() {
			oProxyServer.close();
		});

		// should  proxy to port 8080
		http.get("http://localhost:9000" + sExpectedPath, function(oResponse) {
			oResponse.on("data", function(oData) {
				sActualResponse += oData;
			});
			iActualStatusCode = oResponse.statusCode;
			oResponse.on("end", function() {
				assert.equal(sActualPath, sExpectedPath);
				assert.equal(sActualResponse, sExpectedResponse);
				assert.equal(iActualStatusCode, iExpectedStatusCode);
				oProxyServer.on("close", fnDone);
				oServerToBeProxied.close();
			});
		});
	});
});

