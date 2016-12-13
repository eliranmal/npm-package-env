'use strict';


function init() {

    let _proxy;
    let _prefix = [];
    let _namespace = [];


    function next(key) {
        _namespace = _namespace.concat(key).filter(Boolean);
        return _proxy;
    }

    function prev() {
        _namespace.pop();
        return _proxy;
    }

    function reset() {
        _namespace = [];
    }

    function prefix(...prefixes) {
        _prefix = [];
        prefixes.forEach((p) => {
            _prefix.push(p);
        });
        return _proxy;
    }

    // todo - use this to delegate toString?
    function string() {
        let envKey = _prefix.concat(_namespace).filter(Boolean).join('_').replace(/[-]/g, '_');
        return process.env[envKey];
    }

    function array() {
        let val, arr = [], i = 0;
        do {
            let key = `${i++}`;
            next(key);
            val = string();
            if (val) {
                arr.push(val);
            }
            prev();
        } while (val);
        return arr;
    }

    function object(keys) {
        return keys.map(String).reduce((map, key) => {
            next(key);
            let value = string();
            if (value) {
                map[key] = value;
            }
            prev();
            return map;
        }, {});
    }


    const asFunctions = {
        string: string,
        object: object,
        array: array
    };

    
    function asWrapper(type, ...args) {
        let fn = asFunctions[type];
        if (!fn) {
            return;
        }
        let result = fn.call(null, ...args);
        reset();
        return result;
    }


    const publicApi = {
        _as: asWrapper,
        _in: prefix
    };

    _proxy = new Proxy(publicApi, {
        get (trapTarget, key) {
            if (Reflect.has(trapTarget, key)) {
                return Reflect.get(trapTarget, key);
            }
            return next(key);
        }
    });

    return _proxy;
}

module.exports = init();
