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

            it(`should be reflectable`, function () {
                console.log(env.name);
                assert.ok(Reflect.has({'npm-package-env': 'wat'}, env.name));
            });

            it(`should return the same result on multiple invocations`, function () {
                assert.equal(env.name, expectedEnv.name);
                assert.equal(env.name, expectedEnv.name);
            });

            it(`should return the same result on multiple invocations after assigning the chained proxy`, function () {
                let data = env.config['wrap-obj'];
                assert.equal(data.foo, expectedEnv.config['wrap-obj'].foo);
                assert.equal(data.foo, expectedEnv.config['wrap-obj'].foo);
            });

            it(`should not interfere with later accessor calls on the same instance`, function () {
                env.config['wrap-obj'].foo;
                assert.equal(env.version, expectedEnv.version);
            });

            it(`should not interfere with other instances' accessor calls`, function () {
                let conf1 = env.config;
                let conf2 = require('../lib/npm-package-env').config;
                conf1.foo;
                let expected = conf2.foo;
                let actual = expectedEnv.config.foo;
                assert.strictEqual(actual, expected);
            });

            it(`should return the property value as string`, function () {
                let expected = expectedEnv.config.foo;
                let actual = env.config.foo;
                assert.ok(typeof actual === 'string');
                assert.strictEqual(actual, expected);
            });

            describe(`inside an array`, function () {

                it(`should return the property value as string`, function () {
                    let expected = expectedEnv.config['wrap-obj'].arr[1];
                    let actual = env.config['wrap-obj'].arr[1];
                    assert.ok(typeof actual === 'string');
                    assert.strictEqual(actual, expected);
                });
            });

            describe(`inside an object`, function () {

                it(`should return the property value as string`, function () {
                    let expected = expectedEnv.config['wrap-obj'].obj.foo;
                    let actual = env.config['wrap-obj'].obj.foo;
                    assert.ok(typeof actual === 'string');
                    assert.strictEqual(actual, expected);
                });
            });
        });

        describe(`on non-existing value`, function () {

            it(`should return truthy`, function () {
                assert.ok(env.watwatwat);
            });

            it(`should return a similar instance`, function () {
                assert.notStrictEqual(env.watwatwat, env);
            });

            it(`should work with both dot and bracket notation`, function () {
                assert.ok(env.watwatwat);
                assert.ok(env['watwatwat']);
            });
        });
    });

    describe(`property write`, function () {

        beforeEach(function init() {
            env = require('../lib/npm-package-env');
        });

        describe(`on existing value (overwrite)`, function () {

            beforeEach(function init() {
                env.config.foo = expectedEnv.config.foo;
                env.config['wrap-obj'].arr[1] = expectedEnv.config['wrap-obj'].arr[1];
                env.config['wrap-obj'].obj.foo = expectedEnv.config['wrap-obj'].obj.foo;
            });

            it(`should set a new value for the property`, function () {
                let original = env.config.foo;
                env.config.foo = 'lol';
                let updated = env.config.foo;
                assert.notEqual(updated, original);
            });

            it.only(`should not fail on a falsish value`, function () {
                let setter = () => env.config.foo = 0;
                assert.doesNotThrow(setter, TypeError);
            });

            it.only(`should set a new value for the property even if its falsish`, function () {
                let original = env.config.foo;
                env.config.foo = 0;
                let updated = env.config.foo;
                assert.notEqual(updated, original);
            });

            describe(`inside an array`, function () {
                it(`should set a new value for the property`, function () {
                    let original = env.config['wrap-obj'].arr[1];
                    env.config['wrap-obj'].arr[1] = 'lol';
                    let updated = env.config['wrap-obj'].arr[1];
                    assert.notEqual(updated, original);
                });
            });

            describe(`inside an object`, function () {
                it(`should set a new value for the property`, function () {
                    let original = env.config['wrap-obj'].obj.foo;
                    env.config['wrap-obj'].obj.foo = 'lol';
                    let updated = env.config['wrap-obj'].obj.foo;
                    assert.notEqual(updated, original);
                });
            });
        });

        describe(`on non-existing value`, function () {

            it(`should set a new value for the property`, function () {
                let original = env.config['wrap-obj'].obj.watwatwat;
                env.config['wrap-obj'].obj.watwatwat = 'lol';
                let updated = env.config['wrap-obj'].obj.watwatwat;
                assert.notEqual(updated, original);
            });
        });
    });
    
    xdescribe(`property removal`, function () {

        it(`should delete the property value`, function () {
            let original = env.config['wrap-obj'].obj.watwatwat;
            env.config['wrap-obj'].obj.watwatwat = 'lol';
            let updated = env.config['wrap-obj'].obj.watwatwat;
            assert.notEqual(updated, original);
        });
    });
});
                    