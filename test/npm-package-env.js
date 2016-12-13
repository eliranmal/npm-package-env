'use strict';

/*
 * this test must be run as an npm script for the library to work properly
 * 
 * the fixtures are actually the package.json fields, so the root package.json is used for that,
 * and the "config" field is there solely for that purpose.
 */

const assert = require('assert');


describe('npm-package-env', function () {

    const env = require('../lib/npm-package-env');

    beforeEach(function init() {
        env._in('npm_package_config');
    });

    describe('#string', function () {

        it('should return the property value as string', function () {
            let result = env.foo._as('string');
            assert.equal(result, 'bar');
        });

    });

    describe('#array', function () {

        it('should return an array from the specified namespace', function () {
            let result = env.arr._as('array');
            assert(Array.isArray(result));
            assert.equal(result[0], 'foo');
            assert.equal(result[2], 'wat');
        });

    });

    describe('#object', function () {

        it('should return an object from the specified namespace with values from the specified keys', function () {
            let result = env.obj._as('object', ['foo']);
            assert.ok(result);
            assert.equal(result.foo, 'bar');
        });

    });

    xdescribe('when called with dot accessor', function () {
    });

});
