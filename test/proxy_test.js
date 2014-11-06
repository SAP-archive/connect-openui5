// Copyright 2014 SAP SE.
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

var http = require('http');
var assert = require('assert');
var connect = require('connect');
var proxy = require('./../index').proxy;

describe('proxy middleware should proxy generic requests', function () {
	it('should proxy from one server to the other', function (done) {
		var sExpectedResponse = 'All ok!',
			sExpectedPath = '/foo',
			oAppToBeProxied = connect(),
			sActualResponse = '',
			sActualPath;

		oAppToBeProxied.use(function (oRequest, oResponse) {
			sActualPath = oRequest.url;
			oResponse.end(sExpectedResponse);
		});

		var oServerToBeProxied = http.createServer(oAppToBeProxied);
		oServerToBeProxied.listen(8080);

		var oProxyApp = connect();
		oProxyApp.use(proxy());
		var oProxyServer = http.createServer(oProxyApp);
		oProxyServer.listen(9000);

		http.get('http://localhost:9000/http/localhost:8080' + sExpectedPath, function (oResponse) {
			oResponse.on('data', function(oData) {
				sActualResponse += oData;
			});
			iExpectedStatusCode = oResponse.statusCode;
			oResponse.on('end', function () {
				assert.equal(sActualPath, sExpectedPath);
				assert.equal(sActualResponse, sExpectedResponse);

				oServerToBeProxied.close();
				oProxyServer.close();
				done();
			});
		});
	});
});