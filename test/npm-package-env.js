'use strict';

/*
 * this test must be run as an npm script for the library to work properly
 * 
 * the fixtures are actually the package.json fields, so the root package.json is used for that,
 * and the "config" field is there solely for testing purposes.
 */

const assert = require('assert');


describe(`npm-package-env`, function () {

    let env;
    
    describe(`requiring the module`, function () {

        beforeEach(function init() {
            env = require('../lib/npm-package-env');
        });

        it(`should return a new instance`, function () {
            let required = require('../lib/npm-package-env');
            assert.ok(env);
            assert.ok(required);
            assert.equal(typeof required, typeof env, 'disparate types!');
            assert.notStrictEqual(required, env);
        });

        it(`should return a function instance`, function () {
            assert.equal('function', typeof env);
        });
    });
    
    describe(`module instance`, function () {

        beforeEach(function init() {
            env = require('../lib/npm-package-env');
        });

        it(`should be accessible`, function () {
            assert.ok(env.version);
        });

        it(`should be invokable`, function () {
            assert.ok(env.version('string'));
        });
    });
    
    describe(`property access`, function () {

        beforeEach(function init() {
            env = require('../lib/npm-package-env');
        });

        it(`should return the same instance`, function () {
            assert.strictEqual(env, env.version);
        });

        it(`should not collide with native Function properties`, function () {
            assert.equal(env, env.name);
            assert.equal(env, env.constructor);
        });

        it(`should work with both dot and bracket notation`, function () {
            assert.equal(env, env.version);
            assert.equal(env, env['version']);
        });
    });

    describe(`function invocation`, function () {

        let envConfig;
        let expectedConfig;

        before(function bootstrap() {
            env = require('../lib/npm-package-env');
            expectedConfig = require('../package.json').config;
        });

        beforeEach(function init() {
            envConfig = env.config;
        });

        it(`should not interfere with other instances' accessor calls`, function () {
            let env1 = envConfig;
            let env2 = require('../lib/npm-package-env').config;
            env1.foo('string');
            let expected = env2.foo('string');
            let actual = expectedConfig.foo;
            assert.ok(actual);
            assert.strictEqual(expected, actual);
        });

        describe(`called with no arguments`, function () {

            it(`should return the property value as string`, function () {
                let expected = expectedConfig.foo;
                let actual = envConfig.foo();
                assert.ok(typeof actual === 'string');
                assert.strictEqual(expected, actual);
            });
        });

        describe(`called with 'string'`, function () {

            it(`should return the property value as string`, function () {
                let expected = expectedConfig['wrap-obj'].foo;
                let actual = envConfig['wrap-obj'].foo('string');
                assert.ok(typeof actual === 'string');
                assert.strictEqual(expected, actual);
            });
        });

        describe(`called with 'array'`, function () {

            it(`should return an array at the current namespace`, function () {
                let expected = expectedConfig['wrap-obj'].arr;
                let actual = envConfig['wrap-obj'].arr('array');
                assert.ok(Array.isArray(actual));
                assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
                assert.strictEqual(expected[0], actual[0]);
                assert.strictEqual(expected[2], actual[2]);
            });
        });

        describe(`called with 'object'`, function () {

            it(`should return an object at the current namespace with values from the specified keys`, function () {
                let expected = expectedConfig['wrap-obj'].obj;
                let actual = envConfig['wrap-obj'].obj('object', ['foo']);
                assert.ok(actual && typeof actual === 'object' && !Array.isArray(actual));
                assert.strictEqual(expected.foo, actual.foo);
            });
        });
    });
});
