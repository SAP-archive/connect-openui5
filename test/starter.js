// Copyright 2015 SAP SE.
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

var child_process = require('child_process');

describe('Starter - Test remote location env setting in new process (IGNORE and USE must pass)', function () {

    it('Test IGNORE via "proxy_ignore_remote_location_test.js"', function (done) {

        var child_process_options = {
            env: {
                'REMOTE_LOCATION': 'http://localhost:8085'
            }
        };

        var child = child_process.spawn(
            'node', ['node_modules/mocha/bin/mocha', 'test/indirect/proxy_ignore_remote_location_test.js'],
            child_process_options
        );

        child.stdout.pipe(process.stdout, {end: false});
        process.stdin.pipe(child.stdin, {end: false});

        child.on('error', function (err) {
            done(err);
        });
        child.on('exit', function (code) {
            done(code > 0 ? code : undefined);
        });

    });

    it('Test USE via "proxy_use_remote_location_test.js"', function (done) {
        var child_process_options = {
            env: {
                'REMOTE_LOCATION': 'http://localhost:8080'
            }
        };

        var child = child_process.spawn(
            'node', ['node_modules/mocha/bin/mocha', 'test/indirect/proxy_use_remote_location_test.js'],
            child_process_options
        );


        child.stdout.pipe(process.stdout, {end: false});
        process.stdin.pipe(child.stdin, {end: false});

        child.on('error', function (err) {
            done(err);
        });
        child.on('exit', function (code) {
            done(code > 0 ? code : undefined);
        });

    });

});

