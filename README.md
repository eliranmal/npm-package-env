# npm-package-env

> conveniently use `npm_package_` variables using property accessors

[![NPM][1]][2]


## installation

```shell
npm i npm-package-env -S
```


## overview

provides easy access to [per-package config settings][4] (or 
[package variables][3]) via a virtual object.


## API

### `.<property>` / `[<'property-name'>]` (property accessors)

### `get`

retrieves the current value or walks deeper into the `npm_package_` tree. 
equivalent to stating the full variable path in `process.env.npm_package_<var_path>`.

_**Returns:** `{String|I}` the current value, if exists, or a chainable 
object, bound to the new namespace._  


### `set`

sets a new value in the specified namespace, coerced to a string. 
equivalent to assigning a variable value to `process.env.npm_package_<var_path>`.


## examples

all examples assume `npm-script.js` is run via `npm run`, i.e. the 
`package.json` has something like this:

```json
"scripts": {
    "start": "npm-script"
}
```


### getting / setting a value

###### npm-script.js

```javascript
const npmEnv = require('npm-package-env');
npmEnv.config['dev-server'].port; // -> '7777'
npmEnv.config['dev-server'].port = 9999;
npmEnv.config['dev-server'].port; // -> '9999'
```

###### package.json

```json
"config": {
    "dev-server": {
        "port": 7777
    }
}
```


### getting / setting a value inside an array

###### npm-script.js

```javascript
const npmEnv = require('npm-package-env');
npmEnv.keywords[1]; // -> 'bar'
npmEnv.keywords[1] = 'wow';
npmEnv.keywords[1]; // -> 'wow'
```

###### package.json

```json
"keywords": [
    "foo", "bar", "wat"
]
```


### getting / setting a value inside an object

###### npm-script.js

```javascript
const npmEnv = require('npm-package-env');
npmEnv.dependencies['auto-exports']; // -> '14.1.3'
npmEnv.dependencies['auto-exports'] = '~2.0.1';
npmEnv.dependencies['auto-exports']; // -> '~2.0.1'
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