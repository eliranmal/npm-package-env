'use strict';


const converters = {
    string: string,
    object: object,
    array: array
};

let _prefix = [];
let _namespace = [];

function prefix(...prefixes) {
    _prefix = [];
    prefixes.forEach((p) => {
        _prefix.push(p);
    });
}

function next(key) {
    _namespace = _namespace.concat(key).filter(Boolean);
}

function prev() {
    _namespace.pop();
}

function peek(key) {
    next(key);
    let value = string();
    prev();
    return value;
}

function reset() {
    _namespace = [];
}

// todo - use this to delegate toString?
function string() {
    let envKey = _prefix.concat(_namespace).filter(Boolean).join('_').replace(/[-]/g, '_');
    return process.env[envKey];
}

function array() {
    let val, arr = [], i = 0;
    do {
        val = peek(`${i++}`);
        if (val) {
            arr.push(val);
        }
    } while (val);
    return arr;
}

function object(keys) {
    return keys.map(String).reduce((map, key) => {
        let val = peek(key);
        if (val) {
            map[key] = val;
        }
        return map;
    }, {});
}

function convertReset(type, ...args) {
    let fn = converters[type];
    if (!fn) {
        return;
    }
    let result = fn(...args);
    reset();
    return result;
}

function chain(ctx, fn, ...args) {
    fn(...args);
    return ctx;
}

function init() {

    // must be 'var', we want the hoisting here in order to be able to reference the variable inside the proxy handler/target
    var _proxy = new Proxy({
        _as: convertReset,
        _in: chain.bind(null, _proxy, prefix)
    }, {
        get (target, key) {
            if (Reflect.has(target, key)) {
                return Reflect.get(target, key);
            }
            return chain(_proxy, next, key);
        }
    });

    return _proxy;
}


module.exports = init();
