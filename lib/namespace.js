'use strict';


let _delimiter;
let _base;
let _tokens;
let _serializeAsDelimiters;

function push(token) {
    _tokens = _tokens.concat(token).filter(Boolean);
}

function pop() {
    return _tokens.pop();
}

function has(token) {
    return _tokens.includes(token);
}

function value() {
    return [].concat(_base, _tokens);
}
function serialize() {
    return value()
        .join(_delimiter)
        .replace(_serializeAsDelimiters, _delimiter);
}

function isLast(token) {
    let lastIndex = _tokens.lastIndexOf(token);
    return _tokens.length && lastIndex !== -1 && lastIndex === _tokens.length - 1;
}

/**
 * removes last tokens, up to and not including the specified token.
 * @param toToken the token to back into (exclusive!)
 */
function slice(toToken) {
    if (has(toToken) && !isLast(toToken)) {
        _tokens = _tokens.slice(0, _tokens.lastIndexOf(toToken) + 1);
    }
}

function reset() {
    _tokens = [];
}

function resetTo(token) {
    if (token) {
        slice(token);
    } else {
        reset();
    }
}

function setBase(base = []) {
    _base = base;
}

function setDelimiter(delimiter = '') {
    _delimiter = delimiter;
}

function setSerializeAsDelimiters(pattern = '') {
    _serializeAsDelimiters = pattern;
}

function init(options = {}) {

    setBase(options.base);
    setDelimiter(options.delimiter);
    setSerializeAsDelimiters(options.serializeAsDelimiters);
    
    _tokens = [];

    return {
        push: push,
        pop: pop,
        slice: slice,
        reset: reset,
        resetTo: resetTo,
        serialize: serialize
    };
}

module.exports = init;