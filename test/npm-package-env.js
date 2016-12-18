'use strict';

/*
 * this test must run as an npm script for the library to work properly
 * 
 * the fixtures are actually the package.json fields, so the root package.json is used for that,
 * and the "config" field is there solely for testing purposes.
 */


/*
 assert(value[, message])
 assert.deepEqual(actual, expected[, message])
 assert.deepStrictEqual(actual, expected[, message])
 assert.doesNotThrow(block[, error][, message])
 assert.equal(actual, expected[, message])
 assert.fail(actual, expected, message, operator)
 assert.ifError(value)
 assert.notDeepEqual(actual, expected[, message])
 assert.notDeepStrictEqual(actual, expected[, message])
 assert.notEqual(actual, expected[, message])
 assert.notStrictEqual(actual, expected[, message])
 assert.ok(value[, message])
 assert.strictEqual(actual, expected[, message])
 assert.throws(block[, error][, message])
 */

const assert = require('assert');


describe(`npm-package-env`, function () {

    let env, expectedEnv;

    before(function init() {
        expectedEnv = require('../package.json');
    });

    describe(`requiring the module`, function () {

        beforeEach(function init() {
            env = require('../lib/npm-package-env');
        });

        it(`should return an instance`, function () {
            assert.ok(env);
        });

        it(`should return a new instance of the same type on another invocation`, function () {
            let required = require('../lib/npm-package-env');
            assert.ok(required);
            assert.equal(typeof required, typeof env, 'disparate types!');
            assert.notStrictEqual(required, env);
        });
    });

    describe(`property access`, function () {

        beforeEach(function init() {
            env = require('../lib/npm-package-env');
        });

        describe(`on existing value`, function () {

            it(`should return truthy`, function () {
                assert.ok(env.version);
            });

            it(`should work with both dot and bracket notation`, function () {
                assert.ok(env.version);
                assert.ok(env['version']);
            });

            it(`should not interfere with later accessor calls on the same instance`, function () {
                env.config['wrap-obj'].foo;
                assert.equal(expectedEnv.version, env.version);
            });

            it(`should not interfere with other instances' accessor calls`, function () {
                let conf1 = env.config;
                let conf2 = require('../lib/npm-package-env').config;
                conf1.foo;
                let expected = conf2.foo;
                let actual = expectedEnv.config.foo;
                assert.strictEqual(expected, actual);
            });
            
            it(`should return the property value as string`, function () {
                let expected = expectedEnv.config.foo;
                let actual = env.config.foo;
                assert.ok(typeof actual === 'string');
                assert.strictEqual(expected, actual);
            });

            describe(`inside an array`, function () {

                it(`should return the property value as string`, function () {
                    let expected = expectedEnv.config['wrap-obj'].arr[1];
                    let actual = env.config['wrap-obj'].arr[1];
                    assert.ok(typeof actual === 'string');
                    assert.strictEqual(expected, actual);
                });
            });

            describe(`inside an object`, function () {

                it(`should return the property value as string`, function () {
                    let expected = expectedEnv.config['wrap-obj'].obj.foo;
                    let actual = env.config['wrap-obj'].obj.foo;
                    assert.ok(typeof actual === 'string');
                    assert.strictEqual(expected, actual);
                });
            });
        });

        describe(`on non-existing value`, function () {

            it(`should return truthy`, function () {
                assert.ok(env.watwatwat);
            });
            
            it(`should return a similar instance`, function () {
                assert.notStrictEqual(env, env.watwatwat);
            });

            it(`should work with both dot and bracket notation`, function () {
                assert.ok(env.watwatwat);
                assert.ok(env['watwatwat']);
            });
        });
    });
});
