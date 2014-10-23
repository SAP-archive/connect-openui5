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

module.exports = function(grunt) {
	var rProxyUrl = /^\/(http|https)\/([^/]+)\/?(.*)/;

	return function (oRequest, oResponse) {

		var aParts = rProxyUrl.exec(oRequest.url);

		if(!aParts) {
			var sErrorMessage = 'Proxy request malformed: it needs the format protocol/host/path the request was ' + oRequest.url;
			grunt.log.error(sErrorMessage);
			oResponse.writeHead(500);
			oResponse.write(sErrorMessage);
			oResponse.end();
		}

		var sProtocol = aParts[1];
		var sHost = aParts[2];
		var sPath = '/' + aParts[3] || '';

		grunt.log.writeln('Proxy request incoming for protocol: '  + sProtocol + ' host: ' + sHost + ' path: ' + oRequest.url);

		//Rewrite the requests url to the real server path
		oRequest.url = sPath;

		var oProxyOptions = {
			target: sProtocol + '://' + sHost,
			secure: sProtocol === 'https'
		};

		var oProxyServer = httpProxy.createServer(oProxyOptions);

		oProxyServer.on('proxyReq', function(oProxyReq, oRequest) {
			grunt.log.writeln('Proxy request url: ' + oRequest.url);
			oProxyReq.setHeader('host', sHost);
		});

		oProxyServer.on('proxyRes', function () {
			oProxyServer.close();
		});

		oProxyServer.proxyRequest(oRequest, oResponse);

	};

};

