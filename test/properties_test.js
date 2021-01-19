/* eslint-env mocha */
"use strict";

const http = require("http");
const assert = require("assert");
const connect = require("connect");
const serveStatic = require("serve-static");
const properties = require("../").properties;

describe("properties middleware", function() {
	it("should return \"test.properties\" with correct Content-Type header", function(done) {
		const app = connect();

		app.use(properties());
		app.use("/", serveStatic("test/fixtures/properties"));

		const server = http.createServer(app).listen(8080);

		http.get("http://localhost:8080/test.properties", function(res) {
			assert.equal(res.headers["content-type"], "text/plain; charset=ISO-8859-1");

			let responseData = "";

			res.on("data", function(data) {
				responseData += data;
			});

			res.on("end", function() {
				assert.equal(responseData.replace(/(\n)$/, ""), "FOO=B\\u00C4R");
				server.close();
				done();
			});
		});
	});
});
