'use strict';


function init(...prefixes) {
    
    const converters = {
        string: string,
        object: object,
        array: array
    };

    let _proxy;
    let _root = 'npm_package';
    let _prefix = [];
    let _namespace = [];

    function prefix(...prefixes) {
        _prefix = [];
        prefixes.forEach((p) => {
            _prefix.push(p);
        });
        return _proxy;
    }

    function next(key) {
        _namespace = _namespace.concat(key).filter(Boolean);
        return _proxy;
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
            .concat(_root, _prefix, _namespace)
            .filter(Boolean)
            .join('_')
            .replace(/[-]/g, '_');
        return process.env[envKey];
    }

    function resetNamespace() {
        _namespace = [];
    }

    function resetPrefix() {
        _prefix = [];
    }

    function reset() {
        resetNamespace();
        resetPrefix();
    }

// todo - use this to delegate toString?
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

    function object(keys) {
        return keys.map(String).reduce((map, key) => {
            let val = peek(key);
            if (val) {
                map[key] = val;
            }
            return map;
        }, {});
    }

    function _as(type, ...args) {
        let fn = converters[type];
        if (!fn) {
            return;
        }
        let result = fn(...args);
        resetNamespace();
        return result;
    }

    function _in(...args) {
        return init(...args);
    }
    

    prefix(...prefixes);

    _proxy = new Proxy({
        _as: _as,
        _in: _in,
        __meta: {
            _root: _root,
            _prefix: _prefix,
            _namespace: _namespace
        }
    }, {
        get (target, key) {
            if (Reflect.has(target, key)) {
                return Reflect.get(target, key);
            }
            return next(key);
        }
    });

    return _proxy;
}


module.exports = init();
