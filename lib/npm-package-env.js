'use strict';

const ns = require('./namespace')({
    base: ['npm', 'package'],
    delimiter: '_',
    serializeAsDelimiters: /[-]/g
});

const deflectedProperties = ['toString', 'toPrimitive', 'valueOf', 'inspect'];


// empty prevName indicates the first access in the chain
function init(obj = {}, prevName = '') {
    return new Proxy(obj, {
        get (target, name) {
            if (typeof name === 'symbol' || deflectedProperties.includes(name)) {
                return Reflect.get(target, name);
            }
            ns.resetTo(prevName);
            ns.push(name);
            let value = process.env[ns.serialize()];
            if (value) {
                ns.pop();
                return value;
            }
            return init(target, name);
        },
        set (target, name, val) {
            ns.resetTo(prevName);
            ns.push(name);
            let value = String(val);
            process.env[ns.serialize()] = value;
            ns.pop();
            return value;
        }
    });
}


// return a new instance every time
delete require.cache[module.id];


module.exports = init();
