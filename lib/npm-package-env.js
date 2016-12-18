'use strict';


let _root = 'npm_package';
let _namespace = [];

function next(key) {
    _namespace = _namespace.concat(key).filter(Boolean);
}

function value() {
    let envKey = []
        .concat(_root, _namespace)
        .filter(Boolean)
        .join('_')
        .replace(/[-]/g, '_');
    return process.env[envKey];
}

function reset() {
    _namespace = [];
}

function init(obj = {}, prevName = '') {
    return new Proxy(obj, {
        get: function(target, name){
            if (typeof name === 'symbol' || name === 'toString' || name === 'toPrimitive' || name === 'valueOf' || name === 'inspect') {
                return Reflect.get(target, name);
            }
            if (!prevName) { // first in the access chain
                reset();
            }
            next(name);
            return value() || init(target, name);
        }
    });
}


// return a new instance every time
delete require.cache[module.id];


module.exports = init();
