'use strict';


const deflectedProperties = ['toString', 'toPrimitive', 'valueOf', 'inspect'];

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
    return process.env[envKey] = String(value);
}

function reset(to) {
    if (to) {
        while (_namespace[_namespace.length - 1] !== to) {
            _namespace.pop();
        }
    } else { // indicates first access in the chain
        _namespace = [];
    }
}

function init(obj = {}, prevName = '') {
    return new Proxy(obj, {
        get (target, name){
            if (typeof name === 'symbol' || deflectedProperties.includes(name)) {
                return Reflect.get(target, name);
            }
            reset(prevName);
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
