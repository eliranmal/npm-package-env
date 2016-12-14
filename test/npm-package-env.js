'use strict';

/*
 * this test must be run as an npm script for the library to work properly
 * 
 * the fixtures are actually the package.json fields, so the root package.json is used for that,
 * and the "config" field is there solely for testing purposes.
 */

const assert = require('assert');


describe('npm-package-env', function () {

    const env = require('../lib/npm-package-env');

    describe('#_in', function () {

        it('should return self', function () {
            let self = env._in('config');
            assert.ok(self);
            assert.equal(self, env);
        });
    });

    describe('#_as', function () {

        beforeEach(function init() {
            env._in('config');
        });

        describe('string', function () {

            it('should return the property value as string', function () {
                let result = env['wrap-obj'].foo._as('string');
                assert.equal(result, 'bar');
            });
        });

        describe('array', function () {

            it('should return an array from the specified namespace', function () {
                let result = env['wrap-obj'].arr._as('array');
                assert(Array.isArray(result));
                assert.equal(result[0], 'foo');
                assert.equal(result[2], 'wat');
            });
        });

        describe('object', function () {

            it('should return an object from the specified namespace with values from the specified keys', function () {
                let result = env['wrap-obj'].obj._as('object', ['foo']);
                assert(result && typeof result === 'object' && !Array.isArray(result));
                assert.equal(result.foo, 'bar');
            });
        });
    });
    
    xdescribe('when called with dot accessor', function () {
    });

});
