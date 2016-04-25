# 0.6.0 (2016-04-25)

### Breaking changes
- less middleware
  - Set default of parser option `relativeUrls` to `true` [`4d5fca2 ` via less-openui5@0.2.0](https://github.com/SAP/connect-openui5/commit/4d5fca25954049eec4af53c8bd12c54d6ad020aa) (see [`00d892b `](https://github.com/SAP/less-openui5/commit/00d892b95c8c0401b8a61f1b1709dfc4a68cfa26))

### Features
- less middleware
  - enable inline theming parameters [`4d5fca2`](https://github.com/SAP/connect-openui5/commit/4d5fca25954049eec4af53c8bd12c54d6ad020aa)

### All changes
[`0.5.0...0.6.0`](https://github.com/SAP/connect-openui5/compare/0.5.0...0.6.0)


# 0.5.0 (2016-01-20)

### Features
- proxy middleware
  - Add support for modifying the remote location via environment variable [`46c1e56`](https://github.com/SAP/connect-openui5/commit/46c1e56db46357fee59ee072e0c82516d5c17e9e)

### All changes
[`0.4.1...0.5.0`](https://github.com/SAP/connect-openui5/compare/0.4.1...0.5.0)


# 0.4.1 (2015-09-04)

### Fixes
- less middleware
  - Extend default options rather than assign with provided options [`5ae50cd`](https://github.com/SAP/connect-openui5/commit/5ae50cd753ef5e2a3ba2807a70877ef79b6ce433)

### All changes
[`0.4.0...0.4.1`](https://github.com/SAP/connect-openui5/compare/0.4.0...0.4.1)


# 0.4.0 (2015-01-12)

### Features
- proxy middleware
  - allow passing options for [http-proxy](https://github.com/nodejitsu/node-http-proxy#options) [`6ab9920`](https://github.com/SAP/connect-openui5/commit/6ab99201d5d2439ba55017ec8211b4dd8e5ed2a9)

### All changes
[`0.3.0...0.4.0`](https://github.com/SAP/connect-openui5/compare/0.3.0...0.4.0)


# 0.3.0 (2014-11-17)

### Breaking changes
- context middleware
  - removed (not needed anymore) [`7977fde`](https://github.com/SAP/connect-openui5/commit/7977fdeaf53a6caf9f4ef4f410bd01e13927be3c)
- less middleware
  - changed `options` argument to [less-openui5](https://github.com/SAP/less-openui5) options [`bf6d596`](https://github.com/SAP/connect-openui5/commit/bf6d596d67c5915408dc6287d15baa6a5e311c3e)

### Fixes
- proxy middleware
  - now respects the local proxy configuration (environment variables `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`) when making requests [`483e137`](https://github.com/SAP/connect-openui5/commit/483e1377caa0e90e3f4be9cc8ca91b01b4581103)
- less middleware
  - next should not be called after ending the response [`df71ca8`](https://github.com/SAP/connect-openui5/commit/df71ca834247689fd13f8388cc5d16ff17edff47)

### All changes
[`0.2.1...0.3.0`](https://github.com/SAP/connect-openui5/compare/0.2.1...0.3.0)
