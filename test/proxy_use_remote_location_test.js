// Copyright 2018 SAP SE.
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

var http = require('http');
var assert = require('assert');
var connect = require('connect');

//avoid spawning a new process
delete require.cache[require.resolve('../lib/proxy')];
process.env.REMOTE_LOCATION = 'http://localhost:8080';
var proxy = require('../lib/proxy');
delete require.cache[require.resolve('../lib/proxy')];

describe('USE remote location', function () {
	it('should proxy from one server to the server and USE remote location', function (fnDone) {
		//check environment
		assert.equal(proxy._env.remoteLocation,'http://localhost:8080');

		var sExpectedResponse = 'All ok!',
			sExpectedPath = '/foo/bar?pA=1&pB=2',
			iExpectedStatusCode = 200,
			oAppToBeProxied = connect(),
			sActualResponse = '',
			sActualPath,
			iActualStatusCode;

		oAppToBeProxied.use(function (oRequest, oResponse) {
			// no x-forwarded headers expected (wasn't configured in proxy)
			assert.equal(oRequest.headers['x-forwarded-for'], undefined);
			assert.equal(oRequest.headers['x-forwarded-port'], undefined);
			assert.equal(oRequest.headers['x-forwarded-proto'], undefined);
			sActualPath = oRequest.url;
			oResponse.end(sExpectedResponse);
		});

		var oServerToBeProxied = http.createServer(oAppToBeProxied);
		oServerToBeProxied.listen(8080);

		var oProxyApp = connect();
		oProxyApp.use(proxy());
		var oProxyServer = http.createServer(oProxyApp);
		oProxyServer.listen(9000);
		oServerToBeProxied.on('close', function() {
			oProxyServer.close();
		});

		//should  proxy to port 8080
		http.get('http://localhost:9000' + sExpectedPath, function (oResponse) {

			oResponse.on('data', function(oData) {
				sActualResponse += oData;
			});
			iActualStatusCode = oResponse.statusCode;
			oResponse.on('end', function () {
				assert.equal(sActualPath, sExpectedPath);
				assert.equal(sActualResponse, sExpectedResponse);
				assert.equal(iActualStatusCode, iExpectedStatusCode);
				oProxyServer.on('close', fnDone);
				oServerToBeProxied.close();
			});
		});
	});
});

