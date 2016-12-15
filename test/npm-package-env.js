'use strict';

/*
 * this test must be run as an npm script for the library to work properly
 * 
 * the fixtures are actually the package.json fields, so the root package.json is used for that,
 * and the "config" field is there solely for testing purposes.
 */

const assert = require('assert');


describe('npm-package-env', function () {

    let env;

    beforeEach(function init() {
        env = require('../lib/npm-package-env');
    });
    
    it('should allow property access out of the box', function () {
        let name = env.name._as('string');
        assert.ok(name);
    });
    
    describe('#_in', function () {

        it('should return a new instance', function () {
            let envConfig = env._in('config');
            assert.ok(envConfig);
            assert(envConfig !== env);
            assert.equal(typeof envConfig, typeof env);
        });

        it('should return an instance that is bound to the passed prefixes', function () {
            let envConfig = env._in('config');
            assert.equal(envConfig.__meta._prefix[0], 'config');
        });

        it('should not conflict with other instances\' accessor calls', function () {
            let firstName = env.name._as('string');
            let envDependencies = env._in('dependencies');
            envDependencies.name._as('string');
            let secondName = env.name._as('string');
            assert.ok(firstName);
            assert.ok(secondName);
            assert.equal(firstName, secondName);
        });
    });

    describe('#_as', function () {

        let configEnv;
        
        beforeEach(function init() {
            configEnv = env._in('config');
        });

        describe('string', function () {

            it('should return the property value as string', function () {
                let result = configEnv['wrap-obj'].foo._as('string');
                assert.equal(result, 'bar');
            });
        });

        describe('array', function () {

            it('should return an array from the specified namespace', function () {
                let result = configEnv['wrap-obj'].arr._as('array');
                assert(Array.isArray(result));
                assert.equal(result[0], 'foo');
                assert.equal(result[2], 'wat');
            });
        });

        describe('object', function () {

            it('should return an object from the specified namespace with values from the specified keys', function () {
                let result = configEnv['wrap-obj'].obj._as('object', ['foo']);
                assert(result && typeof result === 'object' && !Array.isArray(result));
                assert.equal(result.foo, 'bar');
            });
        });
    });
});
