/* eslint-env mocha */
"use strict";

const http = require("http");
const assert = require("assert");
const connect = require("connect");
const discovery = require("../").discovery;

describe("discovery middleware", function() {
	it("should provide \"app_pages\" json response", function(done) {
		const app = connect();

		app.use("/discovery", discovery({
			appresources: [
				"test/fixtures/discovery/app-resources1",
				"test/fixtures/discovery/app-resources2"
			]
		}));

		const server = http.createServer(app).listen(8080);

		http.get("http://localhost:8080/discovery/app_pages", function(res) {
			let responseData = "";
			res.on("data", function(data) {
				responseData += data;
			});
			res.on("end", function() {
				assert.equal(responseData, JSON.stringify({
					"app_pages": [
						{
							entry: "index.html"
						},
						{
							entry: "foo/bar.htm"
						}
					]
				}));

				server.close();
				done();
			});
		});
	});

	it("should provide \"all_libs\" json response", function(done) {
		const app = connect();

		app.use("/discovery", discovery({
			resources: [
				"test/fixtures/discovery/resources1",
				"test/fixtures/discovery/resources2",
				"test/fixtures/discovery/resources3"
			]
		}));

		const server = http.createServer(app).listen(8080);

		http.get("http://localhost:8080/discovery/all_libs", function(res) {
			let responseData = "";
			res.on("data", function(data) {
				responseData += data;
			});
			res.on("end", function() {
				assert.equal(responseData, JSON.stringify({
					"all_libs": [
						{
							entry: "my/ui/lib"
						},
						{
							entry: "my/legacy/ui/lib"
						},
						{
							entry: "my/ui/l"
						}
					]
				}));

				server.close();
				done();
			});
		});
	});

	it("should provide \"all_tests\" json response", function(done) {
		const app = connect();

		app.use("/discovery", discovery({
			resources: [
				"test/fixtures/discovery/resources1",
				"test/fixtures/discovery/resources2",
				"test/fixtures/discovery/resources3"
			],
			testresources: [
				"test/fixtures/discovery/test-resources1",
				"test/fixtures/discovery/test-resources2",
				"test/fixtures/discovery/test-resources3"
			]
		}));

		const server = http.createServer(app).listen(8080);

		http.get("http://localhost:8080/discovery/all_tests", function(res) {
			let responseData = "";
			res.on("data", function(data) {
				responseData += data;
			});
			res.on("end", function() {
				assert.equal(responseData, JSON.stringify({
					"all_tests": [
						{
							lib: "my.ui.lib",
							name: "qunit/MyControl.qunit.html",
							url: "../my/ui/lib/qunit/MyControl.qunit.html"
						},
						{
							lib: "my.legacy.ui.lib",
							name: "MyControl.htm",
							url: "../my/legacy/ui/lib/MyControl.htm"
						},
						{
							lib: "my.ui.l",
							name: "qunit/MyControl3.qunit.html",
							url: "../my/ui/l/qunit/MyControl3.qunit.html"
						}
					]
				}));

				server.close();
				done();
			});
		});
	});
});
