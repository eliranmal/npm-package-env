# npm-package-env

> conveniently get `npm_package_` variables using property accessors

[![NPM][1]][2]


## installation

```shell
npm i npm-package-env -S
```


## overview

this package provides easy access to [package.json variables][3] (or 
[per-package config settings][4]) via property accessors - both `.dot` and 
`[bracket]` notation are supported.


## API

### `.<property>` / `[<'property-name'>]` (property accessors)

used to walk deeper into the package.json object tree. equivalent to 
stating the full variable path in `process.env.npm_package_<var_path>`.

_**Returns:** `{I}` a self reference (chainable), bound to the new namespace._  


### `<property>(type, [...indices])` (function invocation)

converts the variable value in the current namespace to the specified 
type and returns it.

_**`type`** `{String}` (optional) the result type, one of: `'string'`, `'array'` 
or `'object'`. if type is not passed it defaults to 'string'._  
_**`indices`** `{*}` (optional) when passing `'object'` as the type, 
this is a whitelist of property keys that will be included in the result 
object._  

_**Returns:** `{String|Array|Object}` the current variable value as the 
specified type, or `undefined` if no such variable was found._  


## examples

all examples assume `my-npm-script.js` is run via `npm run`, i.e. the 
`package.json` has something like this:

```json
"scripts": {
    "start": "my-npm-script"
}
```


### getting a string

###### my-npm-script.js

```javascript
const npmEnv = require('npm-package-env');
// with implicit type inference (no args)
npmEnv.config['dev-server'].port(); // -> '7777'
// with explicit type inference
npmEnv.config['dev-server'].port('string'); // -> '7777'
```

###### package.json

```json
"config": {
    "dev-server": {
        "port": 7777
    }
}
```


### getting an array

###### my-npm-script.js

```javascript
const npmEnv = require('npm-package-env');
npmEnv.keywords('array'); // -> ['foo', 'bar', 'wat']
npmEnv.keywords('array')[1]; // -> 'bar'
```

###### package.json

```json
"keywords": [
    "foo", "bar", "wat"
]
```


### getting an object by keys

###### my-npm-script.js

```javascript
const npmEnv = require('npm-package-env');
npmEnv.dependencies('object', ['auto-exports']); // -> {'auto-exports': '14.1.3'}
```

###### package.json

```json
"dependencies": {
    "auto-exports": "14.1.3",
    "npm-package-env": "^2.0.21"
}
```








[1]: https://img.shields.io/npm/v/npm-package-env.svg?style=flat-square
[2]: https://www.npmjs.com/package/npm-package-env
[3]: https://docs.npmjs.com/misc/scripts#packagejson-vars
[4]: https://docs.npmjs.com/misc/config#per-package-config-settings