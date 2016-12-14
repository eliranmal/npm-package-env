# npm-package-env

> conveniently get `npm_package_` variables using property accessors

[![NPM][1]][2]


## installation

```shell
npm i npm-package-env -S
```


## examples

all examples assume `my-npm-script.js` is run via `npm run`, i.e. the 
`package.json` has something like this:

```json
"scripts": {
    "start": "my-npm-script"
}
```


### getting a string

this also demonstrates using both dot and bracket notation for property 
access.

###### my-npm-script.js

```javascript
const npmEnv = require('npm-package-env')._in('npm_package_config');
npmEnv['dev-server'].port._as('string'); // -> '7777'
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
const npmEnv = require('npm-package-env')._in('npm_package');
npmEnv.keywords._as('array'); // -> ['foo', 'bar', 'wat']
npmEnv.keywords._as('array')[1]; // -> 'bar'
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
const npmEnv = require('npm-package-env')._in('npm_package');
npmEnv.dependencies._as('object', ['auto-exports']); // -> {'auto-exports': '14.1.3'}
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