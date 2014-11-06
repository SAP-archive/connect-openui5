connect-openui5
===============

OpenUI5 connect modules.

Provides several middleware you may use with connect or grunt-serve.

Proxy
============

the proxy middleware may be used like this:

var oui5connect = require('connect-openui5');
var connect = require('connect');
var http = require('http');

var oProxyApp = connect();
oProxyApp.use(oui5connect.proxy());
var oProxyServer = http.createServer(oProxyApp);
oProxyServer.listen(9000);


Then your server will be a gerneric proxy that can be called like this:


http://localhost:9000/{http|https}/{targethost}/{targetPath}

Eg you want to proxy https://example.com/foo

http://localhost:9000/https/example.com/foo