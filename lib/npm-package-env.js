'use strict';


let _root = 'npm_package';
let _namespace = [];

function next(key) {
    _namespace = _namespace.concat(key).filter(Boolean);
}

function prev() {
    _namespace.pop();
}

function peek(key) {
    next(key);
    let value = getValue();
    if (value) {
        prev();
    }
    return value;
}

function resolveEnvKey() {
    return []
        .concat(_root, _namespace)
        .filter(Boolean)
        .join('_')
        .replace(/[-]/g, '_');
}

function getValue() {
    let envKey = resolveEnvKey();
    return process.env[envKey];
}

function setValue(value) {
    let envKey = resolveEnvKey();
    return process.env[envKey] = value;
}

function reset() {
    _namespace = [];
}

function init(obj = {}, prevName = '') {
    return new Proxy(obj, {
        get (target, name){
            if (typeof name === 'symbol' || name === 'toString' || name === 'toPrimitive' || name === 'valueOf' || name === 'inspect') {
                return Reflect.get(target, name);
            }
            if (!prevName) { // first in the access chain
                reset();
            }
            return peek(name) || init(target, name);
        },
        set (target, name, val) {
            next(name);
            return setValue(val);  
        }
    });
}


// return a new instance every time
delete require.cache[module.id];


module.exports = init();
