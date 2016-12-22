'use strict';


const deflectedProperties = ['toString', 'toPrimitive', 'valueOf', 'inspect'];

let _root = 'npm_package';
let _namespace = [];

function next(key) {
    _namespace = _namespace.concat(key).filter(Boolean);
}

function prev() {
    return _namespace.pop();
}

function peek(key) {
    next(key);
    let value = getValue();
    if (value) {
        prev();
    }
    return value;
}

function peekAssign(key, val) {
    next(key);
    let result = setValue(val);
    prev();
    return result;
}

function isNotLast(key) {
    return _namespace.includes(key) && _namespace.lastIndexOf(key) !== _namespace.length - 1;    
}

function getValue() {
    let envKey = resolveEnvKey();
    return process.env[envKey];
}

function setValue(value) {
    let envKey = resolveEnvKey();
    return process.env[envKey] = String(value);
}

function resolveEnvKey() {
    return []
        .concat(_root, _namespace)
        .filter(Boolean)
        .join('_')
        .replace(/[-]/g, '_');
}

function reset(to) {
    if (to) {
        if (isNotLast(to)) {
            _namespace = _namespace.slice(0, _namespace.lastIndexOf(to) + 1);
        }
    } else { // indicates first access in the chain
        _namespace = [];
    }
}

function init(obj = {}, prevName = '') {
    return new Proxy(obj, {
        get (target, name) {
            if (typeof name === 'symbol' || deflectedProperties.includes(name)) {
                return Reflect.get(target, name);
            }
            reset(prevName);
            return peek(name) || init(target, name);
        },
        set (target, name, val) {
            reset(prevName);
            return peekAssign(name, val);
        }
    });
}


// return a new instance every time
delete require.cache[module.id];


module.exports = init();
