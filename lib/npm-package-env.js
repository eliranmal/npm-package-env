'use strict';


function init() {

    let proxy;
    let ns = [];
    let prefix = [];

    const target = {

        at: function (...prefixes) {
            prefix = [];
            prefixes.forEach((p) => {
                prefix.push(p);
            });
            return proxy;
        },

        next: function (key) {
            ns = ns.concat(key).filter(Boolean);
            return proxy;
        },

        prev: function () {
            ns.pop();
            return proxy;
        },

        reset: function () {
            ns = [];
        },

        // todo - use this to delegate toString?
        string: function () {
            let envKey = prefix.concat(ns).filter(Boolean).join('_').replace(/[-]/g, '_');
            return process.env[envKey];
        },

        array: function () {
            // todo
        },

        object: function (keys) {
            return keys.reduce((map, key) => {
                this.next(key);
                let value = this.string();
                if (value) {
                    map[key] = value;
                }
                this.prev();
                return map;
            }, {});
        },

        wrapper: function (fn, ...args) {
            let result = fn.call(this, ...args);
            this.reset();
            return result;
        }
    };

    let targetPublicApi = {
        _: {
            at: target.at.bind(target),
            string: target.wrapper.bind(target, target.string),
            array: target.wrapper.bind(target, target.array),
            object: target.wrapper.bind(target, target.object)
        }
    };

    proxy = new Proxy(targetPublicApi, {
        get (trapTarget, key) {
            if (Reflect.has(trapTarget, key)) {
                return Reflect.get(trapTarget, key);
            }
            return target.next.call(target, key);
        }
    });

    return proxy;
}

module.exports = init();
