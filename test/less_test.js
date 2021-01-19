/* eslint-env mocha */
"use strict";

const http = require("http");
const assert = require("assert");
const connect = require("connect");
const less = require("../").less;

describe("less middleware", function() {
	it("should return \"library.css\" with correct content", function(done) {
		const app = connect();

		app.use(less({
			rootPaths: ["test/fixtures/less"]
		}));

		const server = http.createServer(app).listen(8080);

		http.get("http://localhost:8080/test/themes/mytheme/library.css", function(res) {
			assert.equal(res.headers["content-type"], "text/css");

			let responseData = "";

			res.on("data", function(data) {
				responseData += data;
			});

			res.on("end", function() {
				assert.equal(
					responseData, ".myRule {\n  color: #000000;\n  float: left;\n}\n\n" +
					"/* Inline theming parameters */\n" +
					"#sap-ui-theme-test{" +
					"background-image:url('data:text/plain;utf-8,%7B%22myVar%22%3A%22%23000000%22%7D')}\n"
				);
				server.close();
				done();
			});
		});
	});

	it("should return \"library-RTL.css\" with correct content", function(done) {
		const app = connect();

		app.use(less({
			rootPaths: ["test/fixtures/less"]
		}));

		const server = http.createServer(app).listen(8080);

		http.get("http://localhost:8080/test/themes/mytheme/library-RTL.css", function(res) {
			assert.equal(res.headers["content-type"], "text/css");

			let responseData = "";

			res.on("data", function(data) {
				responseData += data;
			});

			res.on("end", function() {
				assert.equal(
					responseData, ".myRule {\n  color: #000000;\n  float: right;\n}\n\n" +
					"/* Inline theming parameters */\n" +
					"#sap-ui-theme-test{" +
					"background-image:url('data:text/plain;utf-8,%7B%22myVar%22%3A%22%23000000%22%7D')}\n"
				);
				server.close();
				done();
			});
		});
	});

	it("should return \"library-parameters.json\" with correct content", function(done) {
		const app = connect();

		app.use(less({
			rootPaths: ["test/fixtures/less"]
		}));

		const server = http.createServer(app).listen(8080);

		http.get("http://localhost:8080/test/themes/mytheme/library-parameters.json", function(res) {
			assert.equal(res.headers["content-type"], "application/json");

			let responseData = "";

			res.on("data", function(data) {
				responseData += data;
			});

			res.on("end", function() {
				assert.equal(responseData, JSON.stringify({
					myVar: "#000000"
				}, null, "\t"));
				server.close();
				done();
			});
		});
	});
});
