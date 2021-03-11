# Changelog
All notable changes to this project will be documented in this file.  
This project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

A list of unreleased changes can be found [here](https://github.com/SAP/connect-openui5/compare/v0.10.2...HEAD).

<a name="v0.10.2"></a>
## [v0.10.2] - 2021-03-11
### Dependency Updates
- Bump less-openui5 from 0.10.0 to 0.11.0 ([#110](https://github.com/SAP/connect-openui5/issues/110)) [`4403a88`](https://github.com/SAP/connect-openui5/commit/4403a8841f1971775bbd9d8dabd1a984c604d431)


<a name="v0.10.1"></a>
## [v0.10.1] - 2021-01-29

<a name="v0.10.0"></a>
## [v0.10.0] - 2020-11-06
### Breaking Changes
- Require Node.js >= 10 [`8c9f87e`](https://github.com/SAP/connect-openui5/commit/8c9f87e1012bb0c6fbf2dc8e323c7ec11bfda877)

### Dependency Updates
- Bump less-openui5 from 0.8.7 to 0.9.0 [`a8cdc7b`](https://github.com/SAP/connect-openui5/commit/a8cdc7bf1c82ba75217db1be50ff502ac3d380df)

### BREAKING CHANGE

Support for older Node.js releases has been dropped.
Only Node.js v10 or higher is supported.


<a name="v0.9.1"></a>
## [v0.9.1] - 2020-09-10
### Bug Fixes
- **proxy middleware:** Remove secure, domain, path, samesite from cookies ([#91](https://github.com/SAP/connect-openui5/issues/91)) [`e9784be`](https://github.com/SAP/connect-openui5/commit/e9784be7c40670ccbb153b7e51adccb8603446d8)


<a name="v0.9.0"></a>
## [v0.9.0] - 2019-11-19
### Breaking Changes
- **less middleware:** Remove support for 'sourceMap' / 'cleancss' options [`39fa504`](https://github.com/SAP/connect-openui5/commit/39fa504b2cbc6e8273d0712b76b64466b6f8d9ce)


<a name="0.8.0"></a>
## [0.8.0] - 2019-10-14
### Breaking Changes
- Drop support for Node.js < 8.5 [`3aefa16`](https://github.com/SAP/connect-openui5/commit/3aefa16e1e3ecb88214ab8b79d1e2840b26f6dba)


[v0.10.2]: https://github.com/SAP/connect-openui5/compare/v0.10.1...v0.10.2
[v0.10.1]: https://github.com/SAP/connect-openui5/compare/v0.10.0...v0.10.1
[v0.10.0]: https://github.com/SAP/connect-openui5/compare/v0.9.1...v0.10.0
[v0.9.1]: https://github.com/SAP/connect-openui5/compare/v0.9.0...v0.9.1
[v0.9.0]: https://github.com/SAP/connect-openui5/compare/0.8.0...v0.9.0
[0.8.0]: https://github.com/SAP/connect-openui5/compare/0.7.7...0.8.0
## 0.7.7 - 2019-07-01

### Fixes
- proxy middleware
  - Removing 'secure' flag of cookies [#50](https://github.com/SAP/connect-openui5/pull/50)

### All changes
[`0.7.6...0.7.7`](https://github.com/SAP/connect-openui5/compare/0.7.6...0.7.7)


## 0.7.6 - 2019-03-13

### Fixes
- proxy middleware
  - Also strip 'secure' cookie flag at the end of the header [#41](https://github.com/SAP/connect-openui5/pull/41)

### All changes
[`0.7.5...0.7.6`](https://github.com/SAP/connect-openui5/compare/0.7.5...0.7.6)


## 0.7.5 - 2018-10-09

### Other changes
- Update less-openui5@0.6.0 [#27](https://github.com/SAP/connect-openui5/pull/27)

### All changes
[`0.7.4...0.7.5`](https://github.com/SAP/connect-openui5/compare/0.7.4...0.7.5)


## 0.7.4 - 2018-05-18

### Other changes
- Update less-openui5 to v0.5.3 [#25](https://github.com/SAP/connect-openui5/pull/25)

### All changes
[`0.7.3...0.7.4`](https://github.com/SAP/connect-openui5/compare/0.7.3...0.7.4)


## 0.7.3 - 2018-03-12

### Other changes
- Update dependencies ([`b8d59ea`](https://github.com/SAP/connect-openui5/commit/b8d59ea8cd1e2db46b5c5f0117f02ed40aa1a097))
- Update copyright years ([`9091d54`](https://github.com/SAP/connect-openui5/commit/9091d5459126a6080a03b5db360c31d9d30c2665))

### All changes
[`0.7.2...0.7.3`](https://github.com/SAP/connect-openui5/compare/0.7.2...0.7.3)


## 0.7.2 - 2017-07-18

### Fixes
- proxy middleware
  - remove "secure" flag from cookies [#18](https://github.com/SAP/connect-openui5/pull/18)

### All changes
[`0.7.1...0.7.2`](https://github.com/SAP/connect-openui5/compare/0.7.1...0.7.2)


## 0.7.1 - 2017-06-22

### Fixes
- proxy middleware
  - fix no_proxy patterns with * wildcard [#16](https://github.com/SAP/connect-openui5/pull/16)

### Other changes
- Travis CI: Test Node.js 4, 6 and 8 with npm v5 [#17](https://github.com/SAP/connect-openui5/pull/17)

### All changes
[`0.7.0...0.7.1`](https://github.com/SAP/connect-openui5/compare/0.7.0...0.7.1)


## 0.7.0 - 2017-03-23

### Breaking changes
- Drop support for Node.js v0.10 [#13](https://github.com/SAP/connect-openui5/pull/13)

### Features
- less middleware
  - Support theme scopes (Belize Themes) [#15](https://github.com/SAP/connect-openui5/pull/15) (via [SAP/less-openui5#10](https://github.com/SAP/less-openui5/pull/10))

### All changes
[`0.6.0...0.7.0`](https://github.com/SAP/connect-openui5/compare/0.6.0...0.7.0)


## 0.6.0 - 2016-04-25

### Breaking changes
- less middleware
  - Set default of parser option `relativeUrls` to `true` [`4d5fca2 ` via less-openui5@0.2.0](https://github.com/SAP/connect-openui5/commit/4d5fca25954049eec4af53c8bd12c54d6ad020aa) (see [`00d892b `](https://github.com/SAP/less-openui5/commit/00d892b95c8c0401b8a61f1b1709dfc4a68cfa26))

### Features
- less middleware
  - enable inline theming parameters [`4d5fca2`](https://github.com/SAP/connect-openui5/commit/4d5fca25954049eec4af53c8bd12c54d6ad020aa)

### All changes
[`0.5.0...0.6.0`](https://github.com/SAP/connect-openui5/compare/0.5.0...0.6.0)


## 0.5.0 - 2016-01-20

### Features
- proxy middleware
  - Add support for modifying the remote location via environment variable [`46c1e56`](https://github.com/SAP/connect-openui5/commit/46c1e56db46357fee59ee072e0c82516d5c17e9e)

### All changes
[`0.4.1...0.5.0`](https://github.com/SAP/connect-openui5/compare/0.4.1...0.5.0)


## 0.4.1 - 2015-09-04

### Fixes
- less middleware
  - Extend default options rather than assign with provided options [`5ae50cd`](https://github.com/SAP/connect-openui5/commit/5ae50cd753ef5e2a3ba2807a70877ef79b6ce433)

### All changes
[`0.4.0...0.4.1`](https://github.com/SAP/connect-openui5/compare/0.4.0...0.4.1)


## 0.4.0 - 2015-01-12

### Features
- proxy middleware
  - allow passing options for [http-proxy](https://github.com/nodejitsu/node-http-proxy#options) [`6ab9920`](https://github.com/SAP/connect-openui5/commit/6ab99201d5d2439ba55017ec8211b4dd8e5ed2a9)

### All changes
[`0.3.0...0.4.0`](https://github.com/SAP/connect-openui5/compare/0.3.0...0.4.0)


## 0.3.0 - 2014-11-17

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
