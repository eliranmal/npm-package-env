'use strict';


function init() {

    let _instance;
    let _root = 'npm_package';
    let _namespace = [];

    const converters = {
        string: string,
        object: object,
        array: array
    };

    function next(key) {
        _namespace = _namespace.concat(key).filter(Boolean);
        return _instance;
    }

    function prev() {
        _namespace.pop();
    }

    function peek(key) {
        next(key);
        let val = value();
        prev();
        return val;
    }

    function value() {
        let envKey = []
            .concat(_root, _namespace)
            .filter(Boolean)
            .join('_')
            .replace(/[-]/g, '_');
        return process.env[envKey];
    }

    function resetNamespace() {
        _namespace = [];
    }

    function string() {
        return value();
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

    function object(...keys) {
        return []
            .concat(keys)
            .map(String)
            .filter(Boolean)
            .reduce((map, key) => {
                let val = peek(key);
                if (val) {
                    map[key] = val;
                }
                return map;
            }, {});
    }

    function _as(type, ...args) {
        let fn;
        if (type) {
            fn = converters[type];
        } else {
            fn = string;
        }
        let result = fn(...args);
        resetNamespace();
        return result;
    }


    _instance = new Proxy(init, {
        get (target, key) {
            return next(key);
        },
        apply (target, ctx, args) {
            return _as.call(ctx, ...args);
        }
    });

    return _instance;
}


// return a new instance every time
delete require.cache[module.id];


module.exports = init();
